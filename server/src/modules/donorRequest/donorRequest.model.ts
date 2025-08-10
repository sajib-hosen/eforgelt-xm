import { Model, Schema, model } from "mongoose";
import { TDonorRequest } from "./donorRequest.interface";

type donorRequestType = Model<TDonorRequest, object>;

const donorRequestSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "BloodPost",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "due", "donated", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const DonorRequest = model<TDonorRequest, donorRequestType>(
  "DonorRequest",
  donorRequestSchema
);
