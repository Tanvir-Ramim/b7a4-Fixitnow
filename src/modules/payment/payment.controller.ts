import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession = async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const userId = req.user?.id;
  const result = await paymentService.createCheckoutSession(
    bookingId,
    userId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Checkout session created successfully",
    data: { result },
  });
};

const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
   console.log("rmim vai vai ami web hook controller a")
  await paymentService.handleWebhook(req.body, signature);

  sendResponse(res, {
            success : true,
            statusCode : 200,
            message : "Webhook triggered successfully",
            data : null
        })
};

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
};
