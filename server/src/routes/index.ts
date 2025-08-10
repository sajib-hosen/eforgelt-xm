import { userRouter } from "../modules/users/user.route";
import { bloodPostRouter } from "../modules/bloodPost/bloodPost.route";
import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.route";
import { donorRequestRouter } from "../modules/donorRequest/donorRequest.route";
import { reviewRouter } from "../modules/review/review.route";

const router = Router();

const routers = [
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/blood-posts",
    route: bloodPostRouter,
  },
  {
    path: "/auth",
    route: AuthRouters,
  },
  {
    path: "/request",
    route: donorRequestRouter,
  },
  {
    path: "/review",
    route: reviewRouter,
  },
];

routers.forEach((route) => router.use(route.path, route.route));

export default router;
