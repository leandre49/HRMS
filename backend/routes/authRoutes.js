import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getCurrentUser);

export default router;
