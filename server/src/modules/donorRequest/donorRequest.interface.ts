import { Types } from "mongoose";

export type TDonorRequest = {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  post: Types.ObjectId;
  status: "pending" | "accepted" | "rejected" | "due" | "donated" | "cancelled";
};
