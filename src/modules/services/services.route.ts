import { Router } from "express";
import { auth } from "../../middlewares/authRoleChecker";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validRequest";
import { createServicesValidation } from "./services.validation";
import { serviceController } from "./services.controller";

const route = Router();

route.post(
  "/",
  auth(Role.ADMIN, Role.TECHNICIAN),
  validateRequest(createServicesValidation),
  serviceController.addServicesController,
);
route.delete(
  "/:id",
  auth(Role.ADMIN, Role.TECHNICIAN),
  serviceController.deleteServiceController,
);

route.get("/", serviceController.getAllServicesController);

export const serviceRoute = route;
