import { Router } from "express";
import userRouter from "../modules/user/user.route";

const router = Router();

// app.use("/api/users", userRouter);
// app.use("/api/quizzes", quizRouter);
// app.use("/api/admin", adminRouter);

const routers = [
  {
    path: "/users",
    route: userRouter,
  },
  // {
  //   path: "/quizzes",
  //   route: bloodPostRouter,
  // },
  // {
  //   path: "/admin",
  //   route: AuthRouters,
  // },
];

routers.forEach((route) => router.use(route.path, route.route));

export default router;
