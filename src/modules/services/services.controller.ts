import httpStatus from "http-status";
import { catchAsynce } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { serviceServices } from "./services.service";
import { sendResponse } from "../../utils/sendResponse";

const addServicesController = catchAsynce(
  async (req: Request, res: Response) => {
    const paylaod = req.body;
    const technicianId = req.user?.id;
    const service = await serviceServices.addServicesService(
      paylaod,
      technicianId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service Add Successfully",
      data: { service },
    });
  },
);

const deleteServiceController = catchAsynce(
  async (req: Request, res: Response) => {
    const { id } = req.params;

  
    await serviceServices.deleteServiceServices(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service Delete Successfully",
    });
  },
);

const getAllServicesController = catchAsynce(
  async (req: Request, res: Response) => {
    const {
      userId,
      categoryId,
      name,
      price,
      limit = "6",
      page = "1",
    } = req.query;
    const result = await serviceServices.getAllServicesService(
      name as string | undefined,
      userId as string | undefined,
      categoryId as string | undefined,
      price as string | undefined,
      Number(limit),
      Number(page),
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      mete: result.meta,
      data: result.services,
    });
  },
);
const getSingleServicesController = catchAsynce(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await serviceServices.getSingleService(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single Services retrieved successfully",
      data: result,
    });
  },
);

export const serviceController = {
  addServicesController,
  deleteServiceController,
  getAllServicesController,
  getSingleServicesController,
};
