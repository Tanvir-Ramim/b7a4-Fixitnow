import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/auth",
    function: userRoutes,
  },
];
modulesRoutes.forEach((route) => {
  router.use(route.path, route.function);
});

export default router;
