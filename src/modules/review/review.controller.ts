import { Request, Response } from "express";

import httpStatus from "http-status";
import { ReviewService } from "./review.service";
import { catchAsynce } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsynce(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.user!.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsynce(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews(
    req.user?.id as string,
    req.user?.role as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
};
