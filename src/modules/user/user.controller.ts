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

const loginUser = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } =
      await userServices.loginUserService(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, //24h hour
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 day
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in successfully",
      data: { accessToken, refreshToken },
    });
  },
);

export const userController = {
  registerUser,
  loginUser,
};
