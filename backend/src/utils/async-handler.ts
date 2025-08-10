// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

// Define a type for your async middleware functions
type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>; // Can return any, but ensures it's a Promise

// This higher-order function wraps your async middleware
const asyncHandler =
    (fn: AsyncRequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export default asyncHandler;
