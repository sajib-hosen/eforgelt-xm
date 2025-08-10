import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../users/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {
  // -------------- checking user is exist or not ---------------
  const user = await User.findOne({ name: payload.name }).select("+password");
  if (!user) {
    throw new AppError(404, "User is not found");
  }

  // -------------- password matching ---------------
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password
  );

  if (!isPasswordMatched) {
    throw new AppError(403, "Wrong password");
  }

  // -------------- user verified or not ---------------
  if (!user.isVerified) {
    throw new AppError(403, "Please verify your email before logging in");
  }

  // -------------- creating access and refresh token using jwt ---------------
  const userPayload = {
    name: user.name,
    email: user.email,
    id: user._id,
  };

  const accessToken = createToken(
    userPayload,
    config.jwt_access_secret as string,
    "15m"
  );

  const refreshToken = createToken(
    userPayload,
    config.jwt_refresh_secret as string,
    "10d"
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  // ------------- checking whether token is sent or not -------------
  if (!token) {
    throw new AppError(403, "You are not authorized");
  }

  // ------------- checking whether user is exist or not -------------
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string
    ) as JwtPayload;

    const { name } = decoded;

    const user = await User.findOne({ name: name });
    if (!user || user.refreshToken !== token) {
      throw new AppError(404, "User is not found");
    }

    // -------------- creating access token using jwt ---------------
    const userPayload = {
      name: user.name,
      email: user.email,
      id: user._id,
    };

    const accessToken = createToken(
      userPayload,
      config.jwt_access_secret as string,
      "15m"
    );
    const refreshToken = createToken(
      userPayload,
      config.jwt_refresh_secret as string,
      "10d"
    );

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (err) {
    throw new AppError(401, "Invalid token");
  }
};

const userNameChecking = async (payload: Partial<TLoginUser>) => {
  const similarUsers = await User.find({
    name: { $regex: `^${payload.name}`, $options: "i" },
  }).select("name");

  return similarUsers;
};

export const AuthServices = {
  loginUser,
  refreshToken,
  userNameChecking,
};
