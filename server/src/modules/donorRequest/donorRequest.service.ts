import { ObjectId } from "mongodb";
import { TDonorRequest } from "./donorRequest.interface";
import { DonorRequest } from "./donorRequest.model";
import mongoose from "mongoose";
import { BloodPost } from "../bloodPost/bloodPost.model";

const donorRequestSendToDatabase = async (payload: TDonorRequest) => {
  //console.log(payload);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const createRequest = await DonorRequest.create([payload], { session });
    if (!createRequest) {
      throw new Error("Failed to send request");
    }

    console.log(createRequest);

    const addRequestToPost = await BloodPost.findByIdAndUpdate(
      payload.post,
      {
        $push: { donarRequest: createRequest[0]._id },
      },
      { new: true, runValidators: true }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    return createRequest[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
  }
};

const getReceivedDonorRequest = async (id: string) => {
  const result = await DonorRequest.find({
    receiver: id,
  })
    .sort({ createdAt: -1 })
    .populate("post")
    .populate("sender", "name email");

  if (!result) {
    throw new Error("Failed to retrieved requests");
  }
  return result;
};

const updatePendingStatusToAccepted = async (id: string) => {
  const result = await DonorRequest.findByIdAndUpdate(
    id,
    { status: "accepted" },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("Failed to retrieved requests");
  }
  return result;
};

const updatePendingStatusToRejected = async (id: string) => {
  const result = await DonorRequest.findByIdAndUpdate(
    id,
    { status: "rejected" },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("Failed to retrieved requests");
  }
  return result;
};

const changeDonarRequestStatus = async (id: string, status: string) => {
  const result = await DonorRequest.findByIdAndUpdate(
    id,
    { status: status },
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new Error("Failed to change requested donor status");
  }

  return result;
};

export default {
  donorRequestSendToDatabase,
  getReceivedDonorRequest,
  updatePendingStatusToAccepted,
  updatePendingStatusToRejected,
  changeDonarRequestStatus,
};
