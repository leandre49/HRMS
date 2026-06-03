import express from 'express';
const router = express.Router();
import * as positionController from '../controllers/positionController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/', verifyToken, positionController.getAllPositions);
router.get('/:id', verifyToken, positionController.getPositionById);
router.post('/', verifyToken, positionController.createPosition);
router.put('/:id', verifyToken, positionController.updatePosition);
router.delete('/:id', verifyToken, positionController.deletePosition);

export default router;
