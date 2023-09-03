import express from 'express';
import { bookController } from './book.controller';

const router = express.Router();

router.get('/', bookController.getAllFromDB);
router.get('/:id', bookController.getOneFromDB);
router.post('/create-book', bookController.insertIntoDB);
router.patch('/:id', bookController.updateOneInDB);
router.delete('/:id', bookController.deleteOneFromDB);

export const bookRoutes = router;
