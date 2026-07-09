import Stripe from "stripe";
import { prisma } from "../../lib/primsa";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  await prisma.payment.update({
    where: {
      transactionId: session.id,
    },
    data: {
      paymentIntentId: session.payment_intent as string,
      status: "SUCCEEDED",
      paidAt: new Date(),
    },
  });

  // Optional: Update booking status here
  // await prisma.booking.update({
  //   where: { id: session.metadata?.bookingId! },
  //   data: { status: "CONFIRMED" },
  // });
};

export const handlePaymentFailed = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  await prisma.payment.update({
    where: {
      paymentIntentId: paymentIntent.id,
    },
    data: {
      status: "FAILED",
    },
  });

  // Optional: Update booking status here
  // const payment = await prisma.payment.findUnique({
  //   where: { paymentIntentId: paymentIntent.id },
  // });
  //
  // if (payment) {
  //   await prisma.booking.update({
  //     where: { id: payment.bookingId },
  //     data: { status: "PAYMENT_FAILED" },
  //   });
  // }
};
