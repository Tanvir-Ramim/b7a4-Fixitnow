import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success:false,
    statusCode:err.status || httpStatus.INTERNAL_SERVER_ERROR,
    name:err.name ||"Internal Server Error" ,
    message: err.message || "Internal Server Error",
    error:err.stack
  });
};
