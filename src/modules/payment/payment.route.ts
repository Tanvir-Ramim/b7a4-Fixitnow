import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/authRoleChecker";
import { Role } from "../../../generated/prisma/enums";

const router=Router()


router.post(
  "/checkout",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  paymentController.createCheckoutSession
);


// router.post(
//   "/webhook",
//   paymentController.stripeWebhook
// );

export const paymentRoute=router