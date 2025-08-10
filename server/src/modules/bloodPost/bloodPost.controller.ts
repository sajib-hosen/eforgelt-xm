import { RequestHandler } from "express";
import bloodPostService from "./bloodPost.service";
import { sendResponse } from "../../util/sendResponse";

const getAllBloodPosts: RequestHandler = async (req, res, next) => {
  //console.log(" post controller", req?.user);
  const { page, limit } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 9;

  const skip = (pageNumber - 1) * limitNumber;
  const result = await bloodPostService.getAllBloodPosts(
    pageNumber,
    limitNumber,
    skip
  );

  sendResponse(res, {
    success: true,
    message: "Got all blood event posts successfully",
    data: result,
  });
};

const getSingleBloodPosts: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const result = await bloodPostService.getSingleBloodPosts(id);

  sendResponse(res, {
    success: true,
    message: "Got single blood event posts successfully",
    data: result,
  });
};

const createBloodPost: RequestHandler = async (req, res, next) => {
  const { bloodPost } = req.body;

  try {
    const result = await bloodPostService.bloodPostSendToDatabase(
      req?.user?.name,
      bloodPost
    );

    sendResponse(res, {
      success: true,
      message: "Blood event posted successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateBloodPost: RequestHandler = async (req, res, next) => {
  //console.log("err");
  try {
    const { id } = req.params;
    const { bloodPost } = req.body;
    //console.log(id, bloodPost);
    const result = await bloodPostService.updateBloodPostToDatabase(
      id,
      bloodPost
    );

    sendResponse(res, {
      success: true,
      message: "Blood event post updated successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const createDonationHistory: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  const { requestId } = req.body;
  try {
    const result = await bloodPostService.saveDonationHistoryIntoDb(
      userId,
      req.body
    );

    sendResponse(res, {
      success: true,
      message: "Blood post accepted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createDonationCancelHistory: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { postId } = req.body;
  // console.log(id, req.body);
  try {
    const result = await bloodPostService.saveDonationCancelHistoryIntoDb(
      id,
      postId
    );

    sendResponse(res, {
      success: true,
      message: "Blood event rejected successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteBloodPost: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await bloodPostService.deleteBloodPost(id);

    sendResponse(res, {
      success: true,
      message: "Blood event post deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updatePostStatus: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await bloodPostService.updatePostStatus(
      id,
      status,
      req.user.name
    );

    sendResponse(res, {
      success: true,
      message: "Blood event post status updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const cancelRequestedDonor: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { donorId } = req.body;

  try {
    const result = await bloodPostService.cancelRequestedDonor(id, donorId);

    sendResponse(res, {
      success: true,
      message: "Requested Donor canceled successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const dueRequestedDonor: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await bloodPostService.dueRequestedDonor(id);

    sendResponse(res, {
      success: true,
      message: "Requested Donor status changed to due successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const donatedRequestedDonor: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const result = await bloodPostService.donatedRequestedDonor(id, userId);

    sendResponse(res, {
      success: true,
      message: "Requested Donor status changed to donated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const bloodPostControllers = {
  createBloodPost,
  updateBloodPost,
  getAllBloodPosts,
  createDonationHistory,
  createDonationCancelHistory,
  deleteBloodPost,
  updatePostStatus,
  getSingleBloodPosts,
  cancelRequestedDonor,
  dueRequestedDonor,
  donatedRequestedDonor,
};
