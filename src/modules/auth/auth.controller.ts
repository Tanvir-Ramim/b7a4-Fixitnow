import { NextFunction, Request, Response } from "express";
import { catchAsynce } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const registerUser = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await authServices.registerAuthService(payload);

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
      await authServices.loginAuthService(payload);

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

const getMyProfileController = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authServices.getMyProfileAuthService(
      req.user?.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile fetch Successfully",
      data: { user },
    });
  },
);
const userBanController = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, activeStatus } = req.body;
    console.log(userId, activeStatus);
    if (!activeStatus || !userId) {
      throw new AppError(
        "User Id and Active Status Value Must Need",
        httpStatus.BAD_REQUEST,
      );
    }
    const user = await authServices.userBanServices(
      userId as string,
      activeStatus,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User update Successfully",
      data: { user },
    });
  },
);

export const AuthController = {
  registerUser,
  loginUser,
  getMyProfileController,
  userBanController,
};
