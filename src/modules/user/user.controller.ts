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

const getMyProfileController = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.getMyProfileService(req.user?.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile fetch Successfully",
      data: { user },
    });
  },
);

const getAllUserController = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUserService();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All user retrieve",
      data: { users },
    });
  },
);

const updateProfileController = catchAsynce(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const userRole = req.user?.role as string;
    const payload = req.body;
    const udpateedProfile = await userServices.updateProfileService(
      userId,
      userRole,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Update Succesfully",
      data: { udpateedProfile },
    });
  },
);

const getTechnicianController = catchAsynce(
  async (req: Request, res: Response) => {
    const { name, experience, skill } = req.query;

    const technicians = await userServices.getTechnicianService(
      experience ? Number(experience) : undefined,
      skill as string | undefined,
      name as string | undefined,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technicians retrive successfully",
      data: { technicians },
    });
  },
);
const getSingleTechnicianController = catchAsynce(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);

    const singleTechnicians = await userServices.getSingleTechnicianService(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single Technicians retrive successfully",
      data: { singleTechnicians },
    });
  },
);

export const userController = {
  registerUser,
  loginUser,
  getMyProfileController,
  getAllUserController,
  updateProfileController,
  getTechnicianController,
  getSingleTechnicianController,
};
