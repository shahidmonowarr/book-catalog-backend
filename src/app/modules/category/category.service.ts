import { Category } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (category: Category) => {
  const result = await prisma.category.create({
    data: category,
  });

  if (!result) {
    throw new Error('Category not created');
  }

  return result;
};

const getAllFromDB = async () => {
  const result = await prisma.category.findMany();

  if (!result) {
    throw new Error('Category not found');
  }

  return result;
};

const getOneFromDB = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });

  if (!result) {
    throw new Error('Category not found');
  }

  return result;
};

const updateOneInDB = async (id: string, category: Partial<Category>) => {
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: category,
  });

  if (!result) {
    throw new Error('Category not found');
  }

  return result;
};

const deleteOneFromDB = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error('Category not found');
  }

  return result;
};

export const categoryService = {
  insertIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneInDB,
  deleteOneFromDB,
};
