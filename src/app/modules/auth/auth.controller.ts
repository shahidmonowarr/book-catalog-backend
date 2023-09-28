import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { authService } from './auth.service';

const signUpController = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signUpService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const signInController = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signInService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signin successfully!',
    token: result.token,
  });
});

export const authController = {
  signUpController,
  signInController,
};
