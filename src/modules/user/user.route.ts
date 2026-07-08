import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validRequest";
import { loginValidationSchema, userValidationSchema } from "./user.validation";
import { auth } from "../../middlewares/authRoleChecker";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/register",
  validateRequest(userValidationSchema),
  userController.registerUser,
);
router.post(
  "/login",
  validateRequest(loginValidationSchema),
  userController.loginUser,
);
router.get(
  "/me",
  auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER),
  userController.getMyProfileController,
);
router.get("/alluser", auth(Role.ADMIN), userController.getAllUserController);

router.put(
  "/updateProfile",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  userController.updateProfileController,
);

// public
router.get("/technicians", userController.getTechnicianController);
router.get("/technicians/:id", userController.getSingleTechnicianController);

export const userRoutes = router;
