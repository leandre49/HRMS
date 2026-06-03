import express from 'express';
const router = express.Router();
import * as reportController from '../controllers/reportController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/on-leave', verifyToken, reportController.getOnLeaveReport);
router.get('/status-summary', verifyToken, reportController.getStatusSummary);

export default router;
