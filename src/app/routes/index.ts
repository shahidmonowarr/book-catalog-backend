import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { bookRoutes } from '../modules/book/book.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { userRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/books',
    route: bookRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
