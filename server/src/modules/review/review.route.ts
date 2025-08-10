import express from "express";

import auth from "../../middlewares/auth";
import reviewController from "./review.controller";

const router = express.Router();

router.post("/create-review", auth(), reviewController.createReview);
router.get("/", reviewController.allReviews);
router.get("/myReview/:id", auth(), reviewController.myReview);
router.patch("/updateReview/:id", auth(), reviewController.updateReview);

export const reviewRouter = router;
