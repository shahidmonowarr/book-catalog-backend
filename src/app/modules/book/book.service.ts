import { Book, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bookSearchableFields } from './book.contants';

const insertIntoDB = async (book: Book) => {
  const result = await prisma.book.create({
    data: book,
    include: {
      category: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { size, page, skip } = paginationHelpers.calculatePagination(options);

  const { search, category, minPrice, maxPrice, ...filterData } = filters;

  const andConditions = [];

  if (search) {
    andConditions.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const convertMinPriceIntoFloat = parseFloat(minPrice);
  const convertMaxPriceIntoFloat = parseFloat(maxPrice);

  if (!isNaN(convertMinPriceIntoFloat) && !isNaN(convertMaxPriceIntoFloat)) {
    andConditions.push({
      AND: [
        {
          price: {
            gte: convertMinPriceIntoFloat,
          },
        },
        {
          price: {
            lte: convertMaxPriceIntoFloat,
          },
        },
      ],
    });
  }

  if (category !== undefined) {
    andConditions.push({
      categoryId: {
        equals: category,
      },
    });
  }

  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.book.findMany({
    include: {
      category: true,
    },
    where: whereConditions,
    skip,
    take: size,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.book.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / size);

  return {
    meta: {
      total,
      page,
      size,
      totalPage,
    },
    data: result,
  };
};

const getOneFromDB = async (id: string) => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const updateOneInDB = async (id: string, book: Partial<Book>) => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: book,
    include: {
      category: true,
    },
  });

  return result;
};

const deleteOneFromDB = async (id: string) => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
  });

  return result;
};

const getBooksByCategory = async (
  id: string,
  options: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { size, page, skip } = paginationHelpers.calculatePagination(options);

  const result = await prisma.book.findMany({
    where: {
      categoryId: id,
    },
    skip,
    take: size,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.book.count({
    where: {
      categoryId: id,
    },
  });
  const totalPage = Math.ceil(total / size);

  return {
    meta: {
      total,
      page,
      size,
      totalPage,
    },
    data: result,
  };
};

export const bookService = {
  insertIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneInDB,
  deleteOneFromDB,
  getBooksByCategory,
};
