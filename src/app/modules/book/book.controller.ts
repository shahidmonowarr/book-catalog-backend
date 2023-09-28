import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BookFilterAbleFields } from './book.contants';
import { bookService } from './book.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BookFilterAbleFields);
  const options = pick(req.query, ['sortBy', 'sortOrder', 'size', 'page']);

  const result = await bookService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getOneFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookService.getOneFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookService.updateOneInDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: result,
  });
});

const deleteOneFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookService.deleteOneFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully',
    data: result,
  });
});

const getBooksByCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const options = pick(req.query, paginationFields);
  //   const filters = pick(req.query, BookFilterAbleFields);
  const result = await bookService.getBooksByCategory(categoryId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books with associated category data fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const bookController = {
  insertIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneInDB,
  deleteOneFromDB,
  getBooksByCategory,
};
