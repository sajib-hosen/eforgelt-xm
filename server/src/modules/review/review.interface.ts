import { Types } from "mongoose";

export type TReview = {
  review: string;
  friends: [Types.ObjectId];
};
