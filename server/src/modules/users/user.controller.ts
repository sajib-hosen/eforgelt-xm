import { RequestHandler } from "express";
import userService from "./user.service";
import { sendResponse } from "../../util/sendResponse";
import { User } from "./user.model";

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body;
    //console.log("user from controller", user);
    const result = await userService.createUserRegistration(user);

    res.status(200).json({
      success: true,
      message: "User is registration request received successfully",
      data: result,
    });
  } catch (err) {
    console.log("createUser Controller", err);
    next(err);
  }
};

const activeUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getAllActiveUsers();

    res.status(200).json({
      success: true,
      message: "Retrieved all active users",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const allUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req?.user?.name);

    res.status(200).json({
      success: true,
      message: "Retrieved all users",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const usersWithDonationHistory: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getAllUsersWithDonationHistory();

    res.status(200).json({
      success: true,
      message: "Retrieved all users with respective donation history",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleUser: RequestHandler = async (req, res, next) => {
  const { name } = req.params;
  try {
    const result = await userService.getSingleUser(name as string);

    res.status(200).json({
      success: true,
      message: "Retrieved single user successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUserRegistration(id, req.body);

    sendResponse(res, {
      success: true,
      message: "User profile is updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getMyPost: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getMyPost(req?.user?.name);

    sendResponse(res, {
      success: true,
      message: "My posts are retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getRequestedDonor: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await userService.getRequestedDonor(id);

    sendResponse(res, {
      success: true,
      message: "Requested donors are retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getMyDonationHistory: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getMyDonationHistory(req?.user?.name);

    sendResponse(res, {
      success: true,
      message: "My donation history are retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const makeConnection: RequestHandler = async (req, res, next) => {
  //console.log("cc", req.params);
  const { id } = req?.params;
  try {
    const result = await userService.makeConnection({
      id,
      name: req?.user?.name,
    });

    sendResponse(res, {
      success: true,
      message: "Connection created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const makingConnection: RequestHandler = async (req, res, next) => {
  //console.log("cc", req.body);
  try {
    const result = await userService.makeConnection({
      id: req?.body,
      name: req?.user?.name,
    });

    sendResponse(res, {
      success: true,
      message: "Connection created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const connectedUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.connectedUsers(req?.user?.name);

    sendResponse(res, {
      success: true,
      message: "Connected users are retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const pointReduction: RequestHandler = async (req, res, next) => {
  try {
    const { postId, userId } = req.body;
    const result = await userService.pointReduction(
      req?.params?.name,
      postId,
      userId
    );

    sendResponse(res, {
      success: true,
      message: "User point reduced successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.changePassword(req.user.name);

    sendResponse(res, {
      success: true,
      message: "OTP sent to email",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const { otp } = req.query;
    const result = await userService.verifyOtp(req.user.name, otp as string);

    sendResponse(res, {
      success: true,
      message: "OTP verified",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { otp, password } = req.body;
    const result = await userService.resetPassword(
      req.user.name,
      otp,
      password
    );

    sendResponse(res, {
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateLastSeen: RequestHandler = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      lastSeenAt: new Date(),
    });

    sendResponse(res, {
      success: true,
      message: null,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createUser,
  updateUser,
  activeUsers,
  allUsers,
  usersWithDonationHistory,
  getSingleUser,
  getMyPost,
  getMyDonationHistory,
  makeConnection,
  makingConnection,
  connectedUsers,
  pointReduction,
  getRequestedDonor,
  changePassword,
  verifyOtp,
  resetPassword,
  updateLastSeen,
};
