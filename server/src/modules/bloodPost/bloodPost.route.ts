import express from "express";
import { bloodPostControllers } from "./bloodPost.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", bloodPostControllers.getAllBloodPosts);
router.get(
  "/single-post/:id",
  auth(),
  bloodPostControllers.getSingleBloodPosts
);
router.post("/create-post", auth(), bloodPostControllers.createBloodPost);
router.patch("/:id", bloodPostControllers.updateBloodPost);
router.patch(
  "/create-donation-history/:userId",
  bloodPostControllers.createDonationHistory
);
router.patch(
  "/update-post-status/:id",
  auth(),
  bloodPostControllers.updatePostStatus
);
router.patch(
  "/create-donation-cancel-history/:id",
  bloodPostControllers.createDonationCancelHistory
);
router.delete("/delete-blood-post/:id", bloodPostControllers.deleteBloodPost);
router.patch(
  "/cancel-requested-donor/:id",
  bloodPostControllers.cancelRequestedDonor
);
router.patch(
  "/due-requested-donor/:id",
  bloodPostControllers.dueRequestedDonor
);
router.patch(
  "/donated-requested-donor/:id",
  bloodPostControllers.donatedRequestedDonor
);

export const bloodPostRouter = router;
