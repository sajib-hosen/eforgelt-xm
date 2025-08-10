import { Request, Response, NextFunction } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../errors/AppError";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //console.log("req.headers.authorization");

    const token = req.headers.authorization;

    // ----------- checking whether token is sent or not -----------
    if (!token) {
      throw new AppError(401, "you are not authorized");
    }

    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        // ------- err --------
        if (err) {
          throw new AppError(401, "You are not authorized");
        }

        req.user = decoded as JwtPayload;
      }
    );

    next();
  });
};

export default auth;
