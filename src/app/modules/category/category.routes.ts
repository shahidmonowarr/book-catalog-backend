import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { categoryController } from './category.controller';

const router = express.Router();

router.get('/', categoryController.getAllFromDB);
router.get('/:id', categoryController.getOneFromDB);
router.post(
  '/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.insertIntoDB
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.updateOneInDB
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.deleteOneFromDB
);

export const categoryRoutes = router;
