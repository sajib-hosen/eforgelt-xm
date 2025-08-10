import { Router } from "express";
import {
  getAllUsers,
  getUser,
  // updateUser,
  // deleteUser,
} from "./admin.controller";
import asyncHandler from "../../utils/async-handler";
import { adminGuard } from "../../guard/http-guards";

const router = Router();

router.get("/users", asyncHandler(adminGuard), asyncHandler(getAllUsers));
router.get("/users/:id", asyncHandler(getUser));
// router.put("/users/:id", asyncHandler(updateUser));
// router.delete("/users/:id", asyncHandler(deleteUser));

export default router;
