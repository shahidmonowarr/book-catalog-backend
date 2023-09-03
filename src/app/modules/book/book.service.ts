import { Book } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (book: Book) => {
  const result = await prisma.book.create({
    data: book,
    include: {
      category: true,
    },
  });

  return result;
};

export const bookService = {
  insertIntoDB,
};
