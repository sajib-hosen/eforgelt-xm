import { RequestHandler } from "express";
import { sendResponse } from "../../util/sendResponse";
import donarRequestService from "./donorRequest.service";

const createDonorRequest: RequestHandler = async (req, res, next) => {
  try {
    const { request } = req.body;

    const result = await donarRequestService.donorRequestSendToDatabase(
      request
    );

    sendResponse(res, {
      success: true,
      message: "Request sent successfully",
      data: result,
    });
  } catch (error) {
    console.log("1", error);
    next(error);
  }
};

const getReceivedDonorRequest: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const result = await donarRequestService.getReceivedDonorRequest(
      userId as string
    );

    sendResponse(res, {
      success: true,
      message: "Requests retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log("2", error);
    next(error);
  }
};

const updatePendingStatusToAccepted: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { requestId } = req.query;
    const result = await donarRequestService.updatePendingStatusToAccepted(
      requestId as string
    );

    sendResponse(res, {
      success: true,
      message: "Pending status updated successfully",
      data: result,
    });
  } catch (err) {
    console.log("3", err);
    next(err);
  }
};

const updatePendingStatusToRejected: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { requestId } = req.query;
    const result = await donarRequestService.updatePendingStatusToRejected(
      requestId as string
    );

    sendResponse(res, {
      success: true,
      message: "Pending status updated successfully",
      data: result,
    });
  } catch (err) {
    console.log("4", err);
    next(err);
  }
};

const changeDonarRequestStatus: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await donarRequestService.changeDonarRequestStatus(
      id as string,
      status
    );

    sendResponse(res, {
      success: true,
      message: "Changed donar request status successfully",
      data: result,
    });
  } catch (err) {
    console.log("5", err);
    next(err);
  }
};

export const donorRequestControllers = {
  createDonorRequest,
  getReceivedDonorRequest,
  updatePendingStatusToAccepted,
  updatePendingStatusToRejected,
  changeDonarRequestStatus,
};
