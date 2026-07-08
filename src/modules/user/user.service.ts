import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { ILoginUser, IProfileUpdate, IRegisterUser } from "./user.interface";
import httpStatus from "http-status";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jtw";
import { SignOptions } from "jsonwebtoken";

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

const loginUserService = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

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

const getMyProfileService = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const getAllUserService = () => {
  const users = prisma.user.findMany({
    include: { profile: true },
    omit: { password: true },
  });
  return users;
};

const updateProfileService = async (
  userId: string,
  userRole: string,
  payload: IProfileUpdate,
) => {
  const { name, profilePhoto, bio, experience, skills } = payload;
  //customer can not update experience and skill other wise technicion and admin  can update all..but customer can update only name profilephoto and bio
  if (
    userRole === Role.CUSTOMER &&
    (experience !== undefined || skills !== undefined)
  ) {
    throw new AppError(
      "Customer can not update experience and skill",
      httpStatus.UNAUTHORIZED,
    );
  }

  const existingProfile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      skills: true,
    },
  });

  const updatedSkills = [...(existingProfile?.skills ?? []), ...(skills ?? [])];

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      profile: {
        update: {
          profilePhoto,
          bio,
          experience,
          skills: updatedSkills,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return updatedUser;
};

const getTechnicianService = async (
  experience?: number,
  skill?: string,
  name?: string,
) => {
  const where: any = {
    role: "TECHNICIAN",
  };

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (experience !== undefined) {
    where.profile = {
      ...where.profile,
      experience,
    };
  }

  if (skill) {
    where.profile = {
      ...where.profile,
      skills: {
        has: skill,
      },
    };
  }

  const technicians = await prisma.user.findMany({
    where,
    omit: { password: true },
    include: {
      profile: true,
    },
  });

  return technicians;
};
const getSingleTechnicianService = async (userId: string) => {
  const singleTechnicians = await prisma.user.findUniqueOrThrow({
    where: {
      role: "TECHNICIAN",
      id: userId,
    },
    omit: { password: true },
    include: { profile: true },
  });
  return singleTechnicians;
};

export const userServices = {
  registerUserService,
  loginUserService,
  getMyProfileService,
  getAllUserService,
  updateProfileService,
  getTechnicianService,
  getSingleTechnicianService,
};
