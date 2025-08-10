import express from "express";
import { donorRequestControllers } from "./donorRequest.controller";

const router = express.Router();

router.post("/send-request", donorRequestControllers.createDonorRequest);
router.get(
  "/received-request",
  donorRequestControllers.getReceivedDonorRequest
);
router.patch(
  "/status-accepted",
  donorRequestControllers.updatePendingStatusToAccepted
);
router.patch(
  "/status-rejected",
  donorRequestControllers.updatePendingStatusToRejected
);
router.patch(
  "/change-request-status/:id",
  donorRequestControllers.changeDonarRequestStatus
);

export const donorRequestRouter = router;
