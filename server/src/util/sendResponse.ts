import { Response } from "express";

type TResponseData<T> = {
  success: boolean | null;
  message: string | null;
  data: T | null;
};

export const sendResponse = <T>(
  res: Response,
  responseData: TResponseData<T>
) => {
  const statusCode = 200;
  res.status(statusCode).json({
    success: responseData.success,
    message: responseData.message,
    data: responseData.data,
  });
};
