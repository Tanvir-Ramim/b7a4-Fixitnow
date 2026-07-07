import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";

import config from "../config";
import { Role } from "../../generated/prisma/enums";
import { catchAsynce } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jtw";
import { prisma } from "../lib/primsa";
import AppError from "../errors/AppError";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: string;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsynce(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new Error(
          "You are not logged in . Please log in to access this resource",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret,
      );

      if (!verifiedToken.success) {
        throw new AppError("Invalid Token", verifiedToken.error);
      }

      const { email, name, id, role } = verifiedToken.data as JwtPayload;

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          statusCode: httpStatus.FORBIDDEN,
          message:
            "Forbidden. You don't have permission to acces this resource",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id,
          email,
          name,
          role,
        },
      });

      if (!user) {
        throw new AppError(
          "User not found . Please log in again",
          httpStatus.NOT_FOUND,
        );
      }

      if (user.activeStatus === "BANNED") {
        throw new AppError(
          "Your account has been bannned . Please contact support",
          httpStatus.FORBIDDEN,
        );
      }

      req.user = {
        email,
        name,
        id,
        role,
      };

      next();
    },
  );
};
