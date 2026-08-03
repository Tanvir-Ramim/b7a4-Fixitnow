import config from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import httpStatu from "http-status";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted, handlePaymentFailed } from "./payment.utils";
import { TechnicianEnum } from "../../../generated/prisma/enums";

const createCheckoutSession = async (bookingId: string, userId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        customer: true,
        service: true,
      },
    });

    if (!booking) {
      throw new AppError("Booking Not found", httpStatu.NOT_FOUND);
    }

    if (booking.isPayment) {
      throw new AppError(
        "This booking has already been paid.",
        httpStatu.BAD_REQUEST,
      );
    }

    if (booking.technicianAccept !== TechnicianEnum.ACCPECT) {
      throw new AppError(
        "You cannot pay because the technician has not accepted the booking.",
        httpStatu.BAD_REQUEST,
      );
    }

    if (booking.customerId !== userId) {
      throw new AppError(
        "You are not authorized to pay for this booking.",
        httpStatu.FORBIDDEN,
      );
    }

    const payment = await tx.payment.findUnique({
      where: {
        bookingId,
      },
    });

    let stripeCustomerId: string;

    if (payment?.stripeCustomerId) {
      stripeCustomerId = payment.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: booking.customer.email,
        name: booking.customer.name,
        metadata: {
          bookingId: booking.id,
          userId: booking.customer.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer: stripeCustomerId,

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: booking.service.title ?? "Home Service Booking",
            },
            unit_amount: booking.service.price * 100,
          },
          quantity: 1,
        },
      ],

      metadata: {
        bookingId: booking.id,
        userId: booking.customer.id,
      },

      success_url: `https://fixittangail871900.vercel.app/dashboard/booking-list`,
      cancel_url: `https://fixittangail871900.vercel.app/dashboard/booking-list`,
    });

    if (payment) {
      await tx.payment.update({
        where: {
          bookingId,
        },
        data: {
          transactionId: session.id,
          paymentIntentId: "",
          stripeCustomerId,
          amount: booking.service.price,
          currency: "BDT",
          status: "PENDING",
        },
      });
    } else {
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          transactionId: session.id,
          paymentIntentId: "",
          stripeCustomerId,
          userId: booking.customerId,
          amount: booking.service.price,
          currency: "BDT",
          status: "PENDING",
        },
      });
    }

    return session.url;
  });

  return {
    paymentUrl: result,
  };
};
const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;

    case "payment_intent.succeeded":
      console.log("Payment succeeded");
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }
};

const getPaymentsHistorySerivces = async (userId?: string) => {
  return await prisma.payment.findMany({
    where: userId
      ? {
          userId,
        }
      : {},
    include: {
      booking: {
        include: { technician: {
          omit:{password:true}
        } },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
const getSinglePaymentHisotry = async (id: string) => {
  const singlePayment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      booking: true,
      user: {
        omit: { password: true },
      },
    },
  });

  return singlePayment;
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
  getPaymentsHistorySerivces,
  getSinglePaymentHisotry,
};
