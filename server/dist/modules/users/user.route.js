"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/active-users", user_controller_1.default.activeUsers);
router.get("/all-users", user_controller_1.default.allUsers);
router.get("/users-with-donation-history", user_controller_1.default.usersWithDonationHistory);
router.get("/single-user/:id", user_controller_1.default.getSingleUser);
router.post("/user-registration", user_controller_1.default.createUser);
router.patch("/:id", user_controller_1.default.updateUser);
//router.patch("/make-connection", auth(), userController.makeConnection);
router.patch("/make-connection/:id", (0, auth_1.default)(), user_controller_1.default.makeConnection);
router.get("/my-posts", (0, auth_1.default)(), user_controller_1.default.getMyPost);
router.get("/requested-donor/:id", (0, auth_1.default)(), user_controller_1.default.getRequestedDonor);
router.get("/my-donation-history", (0, auth_1.default)(), user_controller_1.default.getMyDonationHistory);
router.get("/connected-users", (0, auth_1.default)(), user_controller_1.default.connectedUsers);
router.patch("/point-reduction/:name", (0, auth_1.default)(), user_controller_1.default.pointReduction);
// router.get("/test", (req, res) => {
//   res.json({ message: "Server is working" });
// });
exports.userRouter = router;
