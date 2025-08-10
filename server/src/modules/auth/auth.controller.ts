import { RequestHandler } from "express";
import { sendResponse } from "../../util/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../users/user.model";

// ------------ user login ------------
const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: config.node_env === "production",
      httpOnly: true,
    });

    sendResponse(res, {
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    console.log("next err", err);
    next(err);
  }
};

// ------------ user login ------------
const logOut: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = jwt.decode(token) as any;
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken");

    sendResponse(res, {
      success: true,
      message: "User logged out",
      data: {
        message: "User logged out",
      },
    });
  } catch (err) {
    next(err);
  }
};

// ------------ user login ------------
const refreshToken: RequestHandler = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  try {
    const result = await AuthServices.refreshToken(token);

    const { refreshToken, accessToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: config.node_env === "production",
      httpOnly: true,
    });

    sendResponse(res, {
      success: true,
      message: "Refresh token is retrieved successfully",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------- during registration similar user name checking ----------
const similarUserNameChecking: RequestHandler = async (req, res, next) => {
  const result = await AuthServices.userNameChecking(req.body);

  if (result.length > 0) {
    sendResponse(res, {
      success: true,
      message:
        "This username is too similar to existing usernames. Please choose a different one.",
      data: result,
    });
  } else {
    sendResponse(res, {
      success: false,
      message: "This username is not exist.",
      data: result,
    });
  }
};

// ----------------------- Email verification ---------------
const verifyEmail: RequestHandler = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(
      token as string,
      config.jwt_access_secret as string
    ) as JwtPayload;
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.isVerified = true;
    await user.save();

    sendResponse(res, {
      success: true,
      message: "Email verified successfully",
      data: "Email verified successfully",
    });
  } catch (err) {
    sendResponse(res, {
      success: false,
      message: "Invalid or expired verification token",
      data: "Invalid or expired verification token",
    });
  }
};

export const AuthControllers = {
  loginUser,
  logOut,
  refreshToken,
  similarUserNameChecking,
  verifyEmail,
};
