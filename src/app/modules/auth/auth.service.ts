import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { ISignInUser, ISignInUserResponse } from './auth.interface';

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

const signInService = async (
  payload: ISignInUser
): Promise<ISignInUserResponse> => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error('Invalid Password');
  }

  // creating access token
  const accessToken = jwtHelpers.createToken(
    { email: user.email, role: user.role, id: user.id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // creating refresh token
  const refreshToken = jwtHelpers.createToken(
    { email: user.email, role: user.role, id: user.id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  signUpService,
  signInService,
};
