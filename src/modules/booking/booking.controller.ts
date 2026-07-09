import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsynce } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { Role } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";

const addBookingController = catchAsynce(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await bookingService.addBookingService(
      req.body,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  },
);

const getAllBookingController = catchAsynce(
  async (req: Request, res: Response) => {
    const { customerId, technicianId } = req.query;
    const role = req.user?.role;

    if (role === Role.CUSTOMER && !customerId) {
      throw new AppError("Customer Id Requied", httpStatus.FORBIDDEN);
    }
    if (role === Role.TECHNICIAN && !technicianId) {
      throw new AppError("technician Id Requied", httpStatus.FORBIDDEN);
    }

    const result = await bookingService.getAllBooking(
      customerId as string,
      technicianId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });
  },
);

const getSingleBookingController = catchAsynce(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await bookingService.getSingleBooking(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: result,
    });
  },
);

const technicianAcceptBookingController = catchAsynce(
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const payload = req.body;
    console.log(payload);
    if (!payload.technicianAccept) {
      throw new AppError(
        "technicianAccept value is required",
        httpStatus.CONFLICT,
      );
    }

    const result = await bookingService.technicianAcceptBooking(
      bookingId as string,
      payload.technicianAccept,
      payload.technicianNotes,
      req.user?.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking updated successfully",
      data: result,
    });
  },
);

export const bookingController = {
  addBookingController,
  getAllBookingController,
  getSingleBookingController,
  technicianAcceptBookingController,
};
