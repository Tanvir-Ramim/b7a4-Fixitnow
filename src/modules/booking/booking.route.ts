import { Router } from "express";
import { auth } from "../../middlewares/authRoleChecker";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";
import validateRequest from "../../middlewares/validRequest";
import { bookingValidation } from "./booking.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),

  validateRequest(bookingValidation),
  bookingController.addBookingController,
);

router.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getAllBookingController,
);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getSingleBookingController,
);

router.patch(
  "/:bookingId/accept",
  auth(Role.TECHNICIAN),
  bookingController.technicianAcceptBookingController,
);

export const bookingRoute = router;
