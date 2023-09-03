import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { bookService } from './book.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Book created successfully',
    data: result,
  });
});

export const bookController = {
  insertIntoDB,
};
