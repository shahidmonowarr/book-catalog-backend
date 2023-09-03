import express from 'express';
import { bookController } from './book.controller';

const router = express.Router();

router.get('/', bookController.getAllFromDB);
router.post('/create-book', bookController.insertIntoDB);

export const bookRoutes = router;
