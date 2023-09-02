import express from 'express';
import { categoryController } from './category.controller';

const router = express.Router();

router.get('/', categoryController.getAllFromDB);
router.get('/:id', categoryController.getOneFromDB);
router.post('/create-category', categoryController.insertIntoDB);
router.patch('/:id', categoryController.updateOneInDB);
router.delete('/:id', categoryController.deleteOneFromDB);

export const categoryRoutes = router;
