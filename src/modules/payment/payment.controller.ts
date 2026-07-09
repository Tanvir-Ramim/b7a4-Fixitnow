import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsynce } from "../../utils/catchAsync";

const createCheckoutSession = catchAsynce(
  async (req: Request, res: Response) => {
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
  },
);

const stripeWebhook = catchAsynce(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  console.log("rmim vai vai ami web hook controller a");
  await paymentService.handleWebhook(req.body, signature);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Webhook triggered successfully",
    data: null,
  });
});

const getPaymentsHistory = catchAsynce(async (req: Request, res: Response) => {
  const userId = req.query.userId;

  const result = await paymentService.getPaymentsHistorySerivces(
    userId as string ,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully",
    data: {result},
  });
});

const getSinglePaymentHistory = catchAsynce(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await paymentService.getSinglePaymentHisotry(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single Payment  retrieved successfully",
      data: {result},
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
  getPaymentsHistory,
  getSinglePaymentHistory,
};
