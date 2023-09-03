import { Order } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (user: any, payload: any): Promise<Order | null> => {
  const { id: userId, role } = user;
  const { orderedBooks } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, `User not found`);
  }

  if (role !== 'customer') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You are not authorized to place order`
    );
  }

  const result = await prisma.order.create({
    data: {
      userId,
      orderedBooks,
    },
  });

  return result;
};

export const orderService = {
  insertIntoDB,
};
