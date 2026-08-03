import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { ILoginUser, IRegisterUser } from "../user/user.interface";
import httpStatus from "http-status";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jtw";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const registerAuthService = async (payload: IRegisterUser) => {
  const { name, email, password, profilePhoto, role } = payload;

  const isUserExits = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExits) {
    throw new AppError(
      "User with this email already exits",
      httpStatus.CONFLICT,
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const { password: _password, ...user } = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role ?? Role.CUSTOMER,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const loginAuthService = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User Not Found. Create New User", httpStatus.NOT_FOUND);
  }

  if (user.activeStatus === ActiveStatus.BANNED) {
    throw new AppError(
      "Your account has been block . Please contact admin",
      httpStatus.FORBIDDEN,
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Password is incrorrectss", httpStatus.UNAUTHORIZED);
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMyProfileAuthService = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: {
        include: { availabilities: true },
      },
    },
  });

  return user;
};

const userBanServices = async (userId: string, activeStatus: ActiveStatus) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      activeStatus,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.activeStatus === "BANNED") {
    throw new Error("User is BANNED!");
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

export const authServices = {
  registerAuthService,
  loginAuthService,
  getMyProfileAuthService,
  userBanServices,
  refreshToken,
};
