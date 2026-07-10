
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

  await prisma.booking.update({
    where: { id: session.metadata?.bookingId! },
    data: { isPayment: true },
  });
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
};
