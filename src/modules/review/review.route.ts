import express from "express";

import { Role } from "../../../generated/prisma/enums";
import { ReviewController } from "./review.controller";
import { auth } from "../../middlewares/authRoleChecker";

const router = express.Router();

router.post("/", auth(Role.CUSTOMER), ReviewController.createReview);

router.get(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  ReviewController.getAllReviews,
);

export const ReviewRoutes = router;
