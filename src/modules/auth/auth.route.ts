import { Router } from "express";
import validateRequest from "../../middlewares/validRequest";

import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/authRoleChecker";
import { Role } from "../../../generated/prisma/enums";
import { loginValidationSchema, userValidationSchema } from "./auth.validation";

const router = Router();
router.post(
  "/register",
  validateRequest(userValidationSchema),
  AuthController.registerUser,
);
router.post(
  "/login",
  validateRequest(loginValidationSchema),
  AuthController.loginUser,
);
router.get(
  "/me",
  auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER),
  AuthController.getMyProfileController,
);
router.put("/update", auth(Role.ADMIN), AuthController.userBanController);

router.post("/refresh-token", AuthController.refreshToken)




export const authRoute = router;
