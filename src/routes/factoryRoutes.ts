import { Router } from 'express';
import { getDashboardStats } from '../controllers/factoryController';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';


const router = Router();

// Protect this route: Only Factory or Admin can see it
router.get('/stats', authenticateToken, authorizeRole(['FACTORY_DISTRIBUTOR', 'ADMIN']), getDashboardStats);


export default router;