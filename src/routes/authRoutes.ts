import { Router } from 'express';
import { register, login, registerEmployee } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/register-employee', registerEmployee); // Now this will work
router.post('/login', login);

export default router;