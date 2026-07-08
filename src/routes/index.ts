import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";

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
];
modulesRoutes.forEach((route) => {
  router.use(route.path, route.function);
});

export default router;
