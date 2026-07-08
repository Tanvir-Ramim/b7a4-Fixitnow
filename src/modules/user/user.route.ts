import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validRequest";
import {
  createAvailabilityValidation,
  updateProfileValidationSchema,
} from "./user.validation";
import { auth } from "../../middlewares/authRoleChecker";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/alluser", auth(Role.ADMIN), userController.getAllUserController);

router.put(
  "/updateProfile",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  validateRequest(updateProfileValidationSchema),
  userController.updateProfileController,
);

// public
router.get("/technicians", userController.getTechnicianController);
router.get("/technicians/:id", userController.getSingleTechnicianController);
// TechnicianAvailability

router.post(
  "/technicians-availablity",
  auth(Role.TECHNICIAN),
  validateRequest(createAvailabilityValidation),
  userController.addAvailabilityController,
);
router.delete(
  "/technicians-availablity/:id",
  auth(Role.TECHNICIAN),
  userController.deleteAvailablityController,
);

export const userRoutes = router;
