import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { ILoginUser, IRegisterUser } from "./user.interface";
import httpStatus from "http-status";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";

const registerUserService = async (payload: IRegisterUser) => {
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

export const userServices = {
  registerUserService,
};
