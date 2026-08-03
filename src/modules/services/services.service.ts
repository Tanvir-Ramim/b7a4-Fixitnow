import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { IServices } from "./services.interface";
import httpStatus from "http-status";
const addServicesService = async (paylaod: IServices, technicianId: string) => {
  const service = await prisma.services.create({
    data: {
      name: paylaod.name,
      title: paylaod.title,
      description: paylaod.description,
      price: paylaod.price as number,
      categoryId: paylaod.categoryId,
      technicianId: technicianId,
    },
    include: {
      category: true,
      technician: {
        include: {
          profile: true,
        },
        omit: { password: true },
      },
    },
  });
  return service;
};

const deleteServiceServices = async (id: string) => {
  const isExits = await prisma.services.findUnique({
    where: { id },
  });

  if (!isExits) {
    throw new AppError("Can not find Service", httpStatus.FORBIDDEN);
  }

  await prisma.services.delete({
    where: { id },
  });
};

const getAllServicesService = async (
  name?: string,
  userId?: string,
  categoryId?: string,
  price?: string,
  limit: number = 10,
  page: number = 1,
) => {
  const where: any = {
    isActive: true,
  };

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (userId) {
    where.technicianId = userId;
  }

  if (price) {
    where.price = Number(price);
  }

  const skip = (page - 1) * limit;

  const [services, total] = await Promise.all([
    prisma.services.findMany({
      where,
      include: {
        technician: {
          omit: { password: true },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.services.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    services,
  };
};
const getSingleService = async (id: string) => {
  const service = await prisma.services.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      technician: {
        include: { profile: { include: { availabilities: true } } },
        omit: { password: true },
      },
    },
  });

  return service;
};
export const serviceServices = {
  addServicesService,
  deleteServiceServices,
  getAllServicesService,
  getSingleService,
};
