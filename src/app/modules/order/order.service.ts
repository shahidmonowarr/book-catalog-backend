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

const getAllOrders = async (user: any) => {
  const { id, role } = user;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, `User not found`);
  }

  if (role === 'admin') {
    const orders = await prisma.order.findMany({});

    return orders;
  }

  if (role === 'customer') {
    const orders = await prisma.order.findMany({
      where: {
        userId: id,
      },
    });

    return orders;
  }
};

const getOrderById = async (orderId: string, user: any) => {
  const { id, role } = user;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, `User not found`);
  }

  if (role === 'admin') {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
      },
    });

    return order;
  }

  if (role === 'customer') {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: id,
      },
    });

    return order;
  }
};

export const orderService = {
  insertIntoDB,
  getAllOrders,
  getOrderById,
};
