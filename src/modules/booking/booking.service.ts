import { TechnicianEnum } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status";

const addBookingService = async (payload: IBooking, userId: string) => {
  const { customerNotes, address, technicianId, serviceId, slotID } = payload;
  const slot = await prisma.technicianAvailability.findUnique({
    where: {
      id: slotID,
    },
  });
  if (!slot?.isSlotActive) {
    throw new AppError(
      "You can not Book with this slot",
      httpStatus.UNAUTHORIZED,
    );
  }

  const booking = await prisma.booking.create({
    data: {
      bookingId: slotID,
      customerNotes: customerNotes,
      address: address,
      customerId: userId,
      technicianId: technicianId,
      serviceId: serviceId,
    },
    include: {
      bookingTime: true,
      service: true,
      customer: {
        omit: { password: true },
      },
      technician: true,
    },
  });

  return booking;
};

const getAllBooking = async (customerId: string, technicianId: string) => {
  const where: any = {};
  if (customerId) {
    where.customerId = customerId;
  }
  if (technicianId) {
    where.technicianId = technicianId;
  }

  const allBooking = await prisma.booking.findMany({
    where,
    include: {
      bookingTime: true,
      service: true,
      customer: {
        omit: { password: true },
      },
      technician: true,
    },
  });

  return allBooking;
};

const getSingleBooking = async (id: string) => {
  const singleBooking = await prisma.booking.findUnique({
    where: { id },
    include: {
      bookingTime: true,
      service: true,
      customer: {
        omit: { password: true },
      },
      technician: true,
    },
  });

  if (!singleBooking) {
    throw new AppError("Booking Not found", httpStatus.NOT_FOUND);
  }

  return singleBooking;
};

const technicianAcceptBooking = async (
  bookingId: string,
  technicianAccept: TechnicianEnum,
  technicianNotes: string,
) => {
  if (technicianAccept == "ACCPECT") {
    const findBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        bookingTime: true,
      },
    });

    if (!findBooking?.bookingTime.isSlotActive) {
      throw new AppError(
        "You can not accpect booking. This slot alreay accpected",
        httpStatus.UNAUTHORIZED,
      );
    }
  }

  const updateBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      technicianAccept,
      technicianNotes,
    },
    include: {
      bookingTime: true,
      service: true,
      customer: {
        omit: { password: true },
      },
      technician: true,
    },
  });

  if (technicianAccept === "ACCPECT") {
    await prisma.technicianAvailability.update({
      where: { id: updateBooking.bookingTime.id },
      data: {
        isSlotActive: false,
      },
    });
  }

  return updateBooking;
};

export const bookingService = {
  addBookingService,
  getAllBooking,
  getSingleBooking,
  technicianAcceptBooking,
};
