import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { categoriesRouter } from "../modules/categories/categories.route";
import { serviceRoute } from "../modules/services/services.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/auth",
    function: authRoute,
  },
  {
    path: "/user",
    function: userRoutes,
  },
  {
    path: "/categories",
    function: categoriesRouter,
  },
  {
    path: "/service",
    function: serviceRoute,
  },
];
modulesRoutes.forEach((route) => {
  router.use(route.path, route.function);
});

export default router;
