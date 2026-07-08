import AppError from "../../errors/AppError";
import { prisma } from "../../lib/primsa";
import { ICategory } from "./categories.interface";
import httpStatus from "http-status";

const addCategoryService = async (payload: ICategory) => {
  const isAlreadyHave = await prisma.categories.findUnique({
    where: { name: payload.name },
  });

  if (isAlreadyHave) {
    throw new AppError("Already Have this Category", httpStatus.CONFLICT);
  }

  const category = await prisma.categories.create({
    data: {
      name: payload.name,
      sortDescriptoin: payload.sortDescriptoin,
    },
  });

  return category;
};

const deleteCategoryService = async (id: string) => {
  const isExits = await prisma.categories.findUnique({
    where: { id },
  });

  if (!isExits) {
    throw new AppError("Already deleted this Category", httpStatus.CONFLICT);
  }

  await prisma.categories.delete({
    where: {
      id,
    },
  });
};

const getAllCategorisService = async () => {
  const categories = await prisma.categories.findMany();
  return categories;
};

export const categoryServices = {
  addCategoryService,
  deleteCategoryService,
  getAllCategorisService,
};
