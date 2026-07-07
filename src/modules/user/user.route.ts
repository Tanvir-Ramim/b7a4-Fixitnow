import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validRequest";
import { loginValidationSchema, userValidationSchema } from "./user.validation";

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

export const userRoutes = router;
