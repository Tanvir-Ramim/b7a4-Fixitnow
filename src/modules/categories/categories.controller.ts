import httpStatus from "http-status";
import { catchAsynce } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { categoryServices } from "./categories.service";
import { sendResponse } from "../../utils/sendResponse";

const addCategoryController = catchAsynce(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const category = await categoryServices.addCategoryService(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully Add Category",
      data: { category },
    });
  },
);
const deleteCategoryController = catchAsynce(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await categoryServices.deleteCategoryService(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully Delete Category",
    });
  },
);
const getAllCategorisController = catchAsynce(
  async (req: Request, res: Response) => {
    const category = await categoryServices.getAllCategorisService();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Categories",
      data: { category },
    });
  },
);

export const categoryController = {
  addCategoryController,
  deleteCategoryController,
  getAllCategorisController,
};
