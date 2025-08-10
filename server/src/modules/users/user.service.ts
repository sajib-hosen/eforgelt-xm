import config from "../../config";
import AppError from "../../errors/AppError";
import { sendVerificationEmail } from "../../util/emailService";
import { BloodPost } from "../bloodPost/bloodPost.model";
import { DonorRequest } from "../donorRequest/donorRequest.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const createUserRegistration = async (payload: TUser) => {
  const isUserAlreadyExist = await User.findOne({ name: payload.name });
  if (isUserAlreadyExist) {
    throw new Error("User is already exists");
  }

  const result = await User.create(payload);

  if (!result) {
    throw new Error("Failed to register new user");
  }
  // Generate email verification token
  const token = jwt.sign(
    { id: result._id },
    config.jwt_access_secret as string,
    { expiresIn: "1h" }
  );

  const verificationLink = `${config.frontend_url}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; text-align: center;">
      <h3>Welcome to Blood Bank</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #d62828; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Verify Email</a>
      </div>
    `;
  // Send the email
  await sendVerificationEmail(result.email, html);

  return result;
};

const getAllActiveUsers = async () => {
  const result = await User.find({ donationAvailability: true });

  if (!result) {
    throw new Error("Failed to retrieve all active users");
  }

  return result;
};

const getAllUsers = async (payload: string) => {
  const specificUser = await User.find({ name: payload });
  //console.log(specificUser[0]);
  const allUsers = await User.find();
  const usersWithoutConnectors = allUsers.filter(
    (user) => !specificUser[0]?.friends?.includes(user?._id)
  );

  if (!usersWithoutConnectors) {
    throw new Error("Failed to retrieve all users");
  }

  return usersWithoutConnectors;
};

const getAllUsersWithDonationHistory = async () => {
  const result = await User.find().populate({
    path: "donationHistory",
    strictPopulate: false,
  });

  if (!result) {
    throw new Error("Failed to retrieve all active users");
  }

  return result;
};

const getSingleUser = async (name: string) => {
  const result = await User.find({ name });

  if (!result) {
    throw new Error("Failed to retrieve single user");
  }

  return result;
};

const updateUserRegistration = async (id: string, user: Partial<TUser>) => {
  // console.log(id, user);
  const result = await User.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new Error("Failed to update user profile");
  }

  return result;
};

const getMyPost = async (uName: string) => {
  const result = await User.findOne({ name: uName }).populate({
    path: "postHistory",
    populate: {
      path: "donarRequest",
      model: "DonorRequest",
    },
  });
  // const result = await User.findOne({ name: uName })
  //   .populate("postHistory")
  //   .populate("donorRequest");

  if (!result) {
    throw new Error("Failed to retrieved my posts");
  }

  return result;
};

const getRequestedDonor = async (id: string) => {
  //console.log(id);
  const result = await BloodPost.findById(id).populate({
    path: "donarRequest",
    populate: {
      path: "receiver",
      model: "User",
    },
  });

  if (!result) {
    throw new Error("Failed to retrieved requested donor");
  }

  return result;
};

const getMyDonationHistory = async (uName: string) => {
  const result = await User.findOne({ name: uName }).populate({
    path: "donationHistory",
    model: DonorRequest,
    populate: {
      path: "post",
      model: BloodPost,
    },
  });

  if (!result) {
    throw new Error("Failed to retrieved my posts");
  }

  return result;
};

const makeConnection = async (payload: { name: string; id: string }) => {
  const result = await User.findOneAndUpdate(
    { name: payload.name },
    {
      $addToSet: { friends: payload.id },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new Error("Failed to create connection");
  }

  return result;
};

const connectedUsers = async (name: string) => {
  const result = await User.find({ name: name }).populate("friends");
  //console.log("connected-user", result);

  if (!result) {
    throw new Error("Failed to find connected users");
  }

  return result;
};

const pointReduction = async (name: string, postId: string, userId: string) => {
  const result = await User.updateOne(
    { name: name, points: { $gte: 1 } },
    {
      $inc: { points: -1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //console.log("result", result, id);

  const numberOpened = {
    user: userId,
    phoneStatus: true,
  };
  const openMobileNumber = await BloodPost.findByIdAndUpdate(
    postId,
    {
      $push: { phoneNumberOpened: numberOpened },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //console.log(openMobileNumber);

  if (!result) {
    throw new Error("Failed to reduce points from user");
  } else if (result.modifiedCount === 0) {
    throw new AppError(200, "You have 0 points");
  }

  return result;
};

const changePassword = async (name: string) => {
  const user = await User.findOne({ name });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  user.otp = code;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) as Date; // 5 minutes
  await user.save();

  //const result = await sendEmail(user.email, "Your OTP Code", `Your OTP is: ${code}`);

  const html = `
    <div style="font-family: sans-serif; text-align: center;">
      <h1>Thanks for staying with Blood Bank</h1>
      <h3>Here is your OTP below:</h3>
      <h3>${code}</h3>
      </div>
    `;
  const result = await sendVerificationEmail(user.email, html);
  return result;
};

const verifyOtp = async (name: string, otp: string) => {
  const user = await User.findOne({ name });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (
    Number(otp) !== user.otp ||
    new Date() > new Date(user.otpExpiresAt as Date)
  ) {
    throw new AppError(400, "OTP is invalid or expired");
  }

  return { message: "OTP verified" };
};

const resetPassword = async (name: string, otp: string, password: string) => {
  const user = await User.findOne({ name });

  console.log(otp, password);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (
    Number(otp) !== user.otp ||
    new Date() > new Date(user.otpExpiresAt as Date)
  ) {
    throw new AppError(400, "OTP is invalid or expired");
  }

  user.password = password;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  return { message: "password reset successfully" };
};
export default {
  createUserRegistration,
  updateUserRegistration,
  getAllActiveUsers,
  getAllUsersWithDonationHistory,
  getSingleUser,
  getMyPost,
  getMyDonationHistory,
  getAllUsers,
  makeConnection,
  connectedUsers,
  pointReduction,
  getRequestedDonor,
  changePassword,
  verifyOtp,
  resetPassword,
};
