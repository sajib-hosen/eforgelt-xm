import { Model, Schema, model } from "mongoose";
import { TReview } from "./review.interface";

type ReviewModel = Model<TReview, object>;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

export const Review = model<TReview, ReviewModel>("Review", reviewSchema);
