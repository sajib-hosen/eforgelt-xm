import { RequestHandler } from "express";

import { sendResponse } from "../../util/sendResponse";
import reviewService from "./review.service";

const createReview: RequestHandler = async (req, res, next) => {
  try {
    const result = await reviewService.createReview(req.body);

    sendResponse(res, {
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (err) {
    console.log("createUser Controller", err);
    next(err);
  }
};

const myReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await reviewService.myReview(id as string);

    sendResponse(res, {
      success: true,
      message: "Review retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const allReviews: RequestHandler = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews();

    sendResponse(res, {
      success: true,
      message: "Retrieved all reviews",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await reviewService.updateReview(id, req.body);

    sendResponse(res, {
      success: true,
      message: "User profile is updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createReview,
  myReview,
  allReviews,
  updateReview,
};
