"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const sendResponse_1 = require("../../util/sendResponse");
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
// ------------ user login ------------
const loginUser = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield auth_service_1.AuthServices.loginUser(req.body);
      console.log("result", result);
      const { refreshToken, accessToken } = result;
      res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.node_env === "production",
        httpOnly: true,
      });
      (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User logged in successfully",
        data: {
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  });
// ------------ user login ------------
const logOut = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      res.clearCookie("accessToken");
      (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User logged out",
        data: {
          message: "User logged out",
        },
      });
    } catch (err) {
      next(err);
    }
  });
// ------------ user login ------------
const refreshToken = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    try {
      const result = yield auth_service_1.AuthServices.refreshToken(
        refreshToken
      );
      (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Refresh token is retrieved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  });
// ---------- during registration similar user name checking ----------
const similarUserNameChecking = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.userNameChecking(req.body);
    if (result.length > 0) {
      (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message:
          "This username is too similar to existing usernames. Please choose a different one.",
        data: result,
      });
    } else {
      (0, sendResponse_1.sendResponse)(res, {
        success: false,
        message: "This username is not exist.",
        data: result,
      });
    }
  });
exports.AuthControllers = {
  loginUser,
  logOut,
  refreshToken,
  similarUserNameChecking,
};
