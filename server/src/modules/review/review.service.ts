import { User } from "../users/user.model";
import { TReview } from "./review.interface";
import { Review } from "./review.model";

const createReview = async (payload: { review: string; user: string }) => {
  const isUserExist = await User.findById(payload.user);
  if (!isUserExist) {
    throw new Error("User not found");
  }

  console.log("review", payload);
  const result = await Review.create(payload);

  if (!result) {
    throw new Error("Failed to create review");
  }

  return result;
};

const myReview = async (id: string) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new Error("User not found");
  }

  const result = await Review.find({ user: id });
  if (!result) {
    throw new Error("Failed to get my review");
  }

  return result;
};

const getAllReviews = async () => {
  const result = await Review.find().populate("user");

  if (!result) {
    throw new Error("Failed to retrieve all users");
  }

  return result;
};

const updateReview = async (
  id: string,
  payload: { review: string; user: string }
) => {
  const isReviewExist = await Review.findById(id);
  if (!isReviewExist) {
    throw new Error("Review not found");
  }
  const result = await Review.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new Error("Failed to update review");
  }
  return result;
};

export default {
  createReview,
  myReview,
  getAllReviews,
  updateReview,
};
