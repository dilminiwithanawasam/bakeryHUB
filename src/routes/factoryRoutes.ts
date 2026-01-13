import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';
import * as factoryController from '../controllers/factoryController';

const router = Router();

router.use(authenticateToken, authorizeRole(['FACTORY_DISTRIBUTOR', 'ADMIN']));

// Define Factory Routes
router.get('/stats', factoryController.getDashboardStats); // matches /api/factory/stats
router.post('/create-batch', factoryController.createBatch); // matches /api/factory/create-batch

export default router;