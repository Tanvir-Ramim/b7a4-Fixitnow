import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { Role } from "../../../generated/prisma/enums";

const createReview = async (
  userId: string,
  payload: {
    bookingId: string;
    rating: number;
    comment?: string;
  },
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId,
    },
    include: {
      review: true,
    },
  });

  if (!booking) {
    throw new AppError("Booking not found", httpStatus.NOT_FOUND);
  }

  if (booking.customerId !== userId) {
    throw new AppError(
      "You can only review your own booking",
      httpStatus.FORBIDDEN,
    );
  }

  if (!booking.isComplete) {
    throw new AppError("Service is not completed yet", httpStatus.BAD_REQUEST);
  }

  if (!booking.isPayment) {
    throw new AppError("Payment must be completed", httpStatus.BAD_REQUEST);
  }

  if (booking.review) {
    throw new AppError("Review already exists", httpStatus.BAD_REQUEST);
  }

  return await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      reviewerId: booking.customerId,
      technicianId: booking.technicianId,
      bookingId: booking.id,
    },
    include: {
      reviewer: true,
      technician: true,
      booking: true,
    },
  });
};

const getAllReviews = async (userId: string, role: string) => {
  let where = {};

  if (role === Role.CUSTOMER) {
    where = {
      reviewerId: userId,
    };
  }

  if (role === Role.TECHNICIAN) {
    where = {
      technicianId: userId,
    };
  }

  return await prisma.review.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reviewer: {
        omit: {
          password: true,
        },
      },
      technician: {
        omit: {
          password: true,
        },
      },
      booking: true,
    },
  });
};

export const ReviewService = {
  createReview,
  getAllReviews,
};
