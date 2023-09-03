import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getProfile = async (user: any | null) => {
  const { id } = user;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, `User not found`);
  }

  const profile = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return profile;
};

export const profileService = {
  getProfile,
};
