import { prisma } from "../../lib/primsa";
import { IServices } from "./services.interface";

const addServicesService = async (paylaod: IServices, technicianId: string) => {
  const service = await prisma.services.create({
    data: {
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

// const deleteServiceServices=async()=>{

// }

export const serviceServices = {
  addServicesService,
};
