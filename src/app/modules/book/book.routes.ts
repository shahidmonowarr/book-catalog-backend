import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { bookController } from './book.controller';

const router = express.Router();

router.get('/', bookController.getAllFromDB);
router.get('/:id', bookController.getOneFromDB);
router.get('/:categoryId/category', bookController.getBooksByCategory);
router.post(
  '/create-book',
  auth(ENUM_USER_ROLE.ADMIN),
  bookController.insertIntoDB
);
router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), bookController.updateOneInDB);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  bookController.deleteOneFromDB
);

export const bookRoutes = router;
