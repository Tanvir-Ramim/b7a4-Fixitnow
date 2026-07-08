import { NextFunction, Request, Response } from "express";
import { catchAsynce } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

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

const addAvailabilityController = catchAsynce(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { slotDate, startTime, endTime } = req.body;
    const technician = await userServices.addAvailabilityService(
      userId,
      new Date(slotDate),
      startTime,
      endTime,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Add Available slot in technician profile",
      data: { technician },
    });
  },
);

const deleteAvailablityController = catchAsynce(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const availabilityId = req.params.id;
    await userServices.deleteAvailablityService(
      userId as string,
      availabilityId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your Availablity Slot delete Suceesfully",
    });
  },
);

export const userController = {
  getAllUserController,
  updateProfileController,
  getTechnicianController,
  getSingleTechnicianController,
  addAvailabilityController,
  deleteAvailablityController,
};
