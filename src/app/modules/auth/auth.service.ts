import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';

const signUpService = async (data: User): Promise<Partial<User>> => {
  const isExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (isExist) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  data.password = hashedPassword;

  const result = await prisma.user.create({
    data,
  });

  if (!result) {
    throw new Error('User not created');
  }

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = result;

  return userWithoutPassword;
};

export const authService = {
  signUpService,
};
