import { Model, Schema, model } from "mongoose";
import { TBloodPost } from "./bloodPost.interface";

type bloodPostType = Model<TBloodPost, object>;

const bloodPostSchema = new Schema(
  {
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    district: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    noOfBags: {
      type: Number,
      required: true,
    },
    accepted: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "donated", "cancelled"],
      default: "pending",
    },
    donarRequest: [
      {
        type: Schema.Types.ObjectId,
        ref: "DonorRequest",
      },
    ],
    postCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    phoneNumberOpened: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        phoneStatus: {
          type: Boolean,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const BloodPost = model<TBloodPost, bloodPostType>(
  "BloodPost",
  bloodPostSchema
);
