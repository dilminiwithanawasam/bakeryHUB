import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const router = Router();

// PUBLIC ROUTE: Anyone can see products
router.get('/', productController.getProducts);

// RBAC PROTECTED ROUTE: Only Factory or Admin can create products
router.post(
  '/', 
  authenticateToken,                   // 1. Must be logged in
  authorizeRole(['FACTORY_DISTRIBUTOR', 'ADMIN']), // 2. Must have specific role
  productController.createProduct      // 3. Execute logic
);

export default router;