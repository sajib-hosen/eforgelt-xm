import { ObjectId } from "mongodb";
import { User } from "../users/user.model";
import { TBloodPost } from "./bloodPost.interface";
import { BloodPost } from "./bloodPost.model";
import AppError from "../../errors/AppError";

const getAllBloodPosts = async (page: number, limit: number, skip: number) => {
  const result = await BloodPost.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (!result) {
    throw new Error("Failed to get all blood event posts");
  }

  return result;
};

const getSingleBloodPosts = async (id: string) => {
  console.log(id);
  const result = await BloodPost.findById(id);

  if (!result) {
    throw new Error("Failed to get single blood event post");
  }

  return result;
};

const bloodPostSendToDatabase = async (
  userName: string,
  payload: TBloodPost
) => {
  //console.log(userName);
  const result = await BloodPost.create(payload);

  const addPostHistory = await User.findOneAndUpdate(
    { name: userName },
    {
      $push: { postHistory: result._id },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new Error("Failed to posting blood event");
  }

  return result;
};

const updateBloodPostToDatabase = async (
  id: string,
  payload: Partial<TBloodPost>
) => {
  //console.log(payload);
  const result = await BloodPost.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new Error("Failed to update blood event post");
  }

  return result;
};

const saveDonationHistoryIntoDb = async (
  id: string,
  payload: { requestId: string }
) => {
  const findUser = await User.findById(id);
  const findDonationHistory = findUser?.donationHistory.includes(
    payload.requestId as unknown as ObjectId
  );
  //console.log("findDonationHistory", findDonationHistory);

  if (findDonationHistory) {
    throw new AppError(200, "This post is already accepted");
  }
  const result = await User.findByIdAndUpdate(
    id,
    {
      $push: { donationHistory: payload.requestId },
      $inc: { accepted: 1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new Error("Failed to add blood donation history");
  }

  return result;
};

const saveDonationCancelHistoryIntoDb = async (
  id: string,
  postId: { id: string }
) => {
  const result = await User.findByIdAndUpdate(
    id,
    {
      $push: { cancelHistory: postId.id },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new Error("Failed to cancel blood donation history");
  }

  return result;
};

const deleteBloodPost = async (id: string) => {
  const result = await BloodPost.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Failed to delete blood post");
  }

  return result;
};

const updatePostStatus = async (
  id: string,
  payload: string,
  userName: string
) => {
  console.log("updatePostStatus", id, userName);
  const result = await BloodPost.findByIdAndUpdate(id, {
    status: payload,
  });

  const increasePoints = await User.findOneAndUpdate(
    { name: userName },
    {
      $inc: { points: 2 },
    },
    { new: true }
  );

  if (!result) {
    throw new Error("Failed to update post status");
  }

  return result;
};

const cancelRequestedDonor = async (id: string, payload: string) => {
  //console.log(id, payload);
  const result = await BloodPost.findByIdAndUpdate(
    id,
    { $pull: { donar: payload } },
    { new: true }
  );

  if (!result) {
    throw new Error("Failed to delete requested donor from donor list");
  }

  return result;
};

const dueRequestedDonor = async (id: string) => {
  const result = await BloodPost.findByIdAndUpdate(
    id,
    {
      $inc: { accepted: 1 },
      status: "due",
    },
    { new: true }
  );

  if (!result) {
    throw new Error("Failed to due requested donor.");
  }

  return result;
};

const donatedRequestedDonor = async (id: string, userId: string) => {
  const result = await BloodPost.findByIdAndUpdate(
    id,
    {
      $inc: { points: 1 },
      status: "donated",
    },
    { new: true }
  );
  const increasePoints = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { points: 1 },
    },
    { new: true }
  );

  if (!result) {
    throw new Error("Failed to updated due to donate status of post.");
  }

  return result;
};

export default {
  getAllBloodPosts,
  bloodPostSendToDatabase,
  updateBloodPostToDatabase,
  saveDonationHistoryIntoDb,
  saveDonationCancelHistoryIntoDb,
  deleteBloodPost,
  updatePostStatus,
  getSingleBloodPosts,
  cancelRequestedDonor,
  dueRequestedDonor,
  donatedRequestedDonor,
};
