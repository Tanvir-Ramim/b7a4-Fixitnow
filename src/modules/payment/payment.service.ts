import config from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import httpStatu from "http-status";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted, handlePaymentFailed } from "./payment.utils";
import { TechnicianEnum } from "../../../generated/prisma/enums";

const createCheckoutSession = async (bookingId: string, userId: string) => {
  console.log("ami checkout a asi")
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

    if (booking.technicianAccept !== TechnicianEnum.ACCPECT) {
      throw new AppError(
        "You can not Payment this Booking because Technician not accpect",
        httpStatu.NOT_FOUND,
      );
    }

    if (booking.customerId !== userId) {
      throw new AppError(
        "This Customer not book this service",
        httpStatu.NOT_FOUND,
      );
    }

    let stripeCustomerId: string;

    const payment = await tx.payment.findUnique({
      where: {
        bookingId,
      },
    });

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
              name: "Home Service Booking",
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

      success_url: `${config.app_url}/payment/success?bookingId=${booking.id}`,
      cancel_url: `${config.app_url}/payment/cancel?bookingId=${booking.id}`,
    });

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        transactionId: session.id,
        paymentIntentId: "",
        stripeCustomerId,
        amount: booking.service.price,
        currency: "BDT",
        status: "PENDING",
      },
    });

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
  console.log("ramim handlebook a dulsi service");
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

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
};
