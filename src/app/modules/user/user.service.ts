import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';

const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  const usersWithoutPassword = users.map(user => {
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return usersWithoutPassword;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const updateUserById = async (id: string, data: Partial<User>) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  if (!user) {
    throw new Error('User not found');
  }

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const deleteUserById = async (id: string) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
