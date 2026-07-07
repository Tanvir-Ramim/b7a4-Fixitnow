import { NextFunction, Request, Response } from "express";
import { catchAsynce } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServices.registerUserService(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Register Successfully",
      data: { user },
    });
  },
);

export const userController = {
  registerUser,
};
