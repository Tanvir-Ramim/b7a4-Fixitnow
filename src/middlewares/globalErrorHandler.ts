import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode,
    name: err.name || "Internal Server Error",
    message: err.message || "Internal Server Error",
    error: err.stack,
  });
};
