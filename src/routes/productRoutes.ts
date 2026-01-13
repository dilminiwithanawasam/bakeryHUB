import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';
import * as productController from '../controllers/productController';

const router = Router();

// Protect routes
router.use(authenticateToken, authorizeRole(['FACTORY_DISTRIBUTOR', 'ADMIN']));

// Define Product Routes
router.get('/', productController.getProducts);           // matches /api/products
router.post('/add', productController.createProduct);     // matches /api/products/add

export default router;