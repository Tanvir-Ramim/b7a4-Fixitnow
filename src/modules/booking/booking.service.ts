import { TechnicianEnum } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status";

const addBookingService = async (payload: IBooking, userId: string) => {
  const { customerNotes, address, serviceId, slotID } = payload;

  const isExitsService = await prisma.services.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      technician: {
        include: {
          profile: true,
        },
      },
    },
  });
  if (!isExitsService) {
    throw new AppError("Not found service", httpStatus.NOT_FOUND);
  }

  const slot = await prisma.technicianAvailability.findUnique({
    where: {
      id: slotID,
      profileId: isExitsService.technician.profile?.id,
    },
  });

  if (!slot) {
    throw new AppError(
      "This slot is not this Technician",
      httpStatus.BAD_REQUEST,
    );
  }

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
      technicianId: isExitsService?.technicianId,
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
  technicianId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId, technicianId: technicianId },
      include: {
        bookingTime: true,
      },
    });

    if (!booking) {
      throw new AppError("Booking not found", httpStatus.NOT_FOUND);
    }

    if (technicianAccept === "ACCPECT" && !booking.bookingTime.isSlotActive) {
      throw new AppError(
        "You cannot accept this booking. This slot is already booked.",
        httpStatus.BAD_REQUEST,
      );
    }

    if (technicianAccept === "ACCPECT") {
      await tx.technicianAvailability.update({
        where: { id: booking.bookingTime.id },
        data: {
          isSlotActive: false,
        },
      });
    }

    if (technicianAccept === "CANCEL") {
      await tx.technicianAvailability.update({
        where: { id: booking.bookingTime.id },
        data: {
          isSlotActive: true,
        },
      });
    }

    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        technicianAccept,
        technicianNotes,
      },
      include: {
        bookingTime: true,
        service: true,
        customer: {
          omit: {
            password: true,
          },
        },
        technician: {
          omit: {
            password: true,
          },
        },
      },
    });

    return updatedBooking;
  });
};
export const bookingService = {
  addBookingService,
  getAllBooking,
  getSingleBooking,
  technicianAcceptBooking,
};
