import { Role } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { IProfileUpdate } from "./user.interface";
import httpStatus from "http-status";

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

//TechnicianAvailability

const addAvailabilityService = async (
  userId: string,
  slotDate: Date,
  startTime: string,
  endTime: string,
) => {
  const profile = await prisma.profile.findUniqueOrThrow({ where: { userId } });
  const existingSlot = await prisma.technicianAvailability.findFirst({
    where: {
      profileId: profile.id,
      slotDate: new Date(slotDate),
      startTime: startTime,
      endTime: endTime,
      isSlotActive: true,
    },
  });

  if (existingSlot) {
    throw new AppError(
      "This time slot already exists for this date",
      httpStatus.FORBIDDEN,
    );
  }

  const availability = await prisma.technicianAvailability.create({
    data: {
      slotDate: new Date(slotDate),
      startTime,
      endTime,
      profileId: profile.id,
    },
    include: {
      profile: {
        include: {
          user: {
            omit: { password: true },
          },
        },
      },
    },
  });

  return availability;
};

const deleteAvailablityService = async (
  userId: string,
  availabilityId: string,
) => {
  const profile = await prisma.profile.findUniqueOrThrow({ where: { userId } });

  const existingSlot = await prisma.technicianAvailability.findFirst({
    where: {
      profileId: profile.id,
      id: availabilityId,
    },
  });

  if (!existingSlot) {
    throw new AppError(
      "Can not find this slot already deleted",
      httpStatus.FORBIDDEN,
    );
  }

  const result = await prisma.technicianAvailability.delete({
    where: {
      profileId: profile?.id,
      id: availabilityId,
    },
  });

  console.log(result);
};

export const userServices = {
  getAllUserService,
  updateProfileService,
  getTechnicianService,
  getSingleTechnicianService,
  addAvailabilityService,
  deleteAvailablityService,
};
