import { Router } from "express";
import { auth } from "../../middlewares/authRoleChecker";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./categories.controller";
import validateRequest from "../../middlewares/validRequest";
import { addCategoryValidation } from "./categories.validation";

const router = Router();
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(addCategoryValidation),
  categoryController.addCategoryController,
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  categoryController.deleteCategoryController,
);
router.get(
  "/",
  auth(Role.ADMIN, Role.TECHNICIAN),
  categoryController.getAllCategorisController,
);

export const categoriesRouter = router;
