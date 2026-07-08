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
  categoryId?: string,
  price?: string,
) => {
  const where: any = {
    isActive: true || false,
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

  if (price) {
    where.price = Number(price);
  }

  const services = await prisma.services.findMany({
    where,
    include: {
      technician: {
        omit: { password: true },
      },
      category: true,
    },
  });

  return services;
};
export const serviceServices = {
  addServicesService,
  deleteServiceServices,
  getAllServicesService,
};
