import express from 'express';
const router = express.Router();
import * as departmentController from '../controllers/departmentController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/', verifyToken, departmentController.getAllDepartments);
router.get('/:id', verifyToken, departmentController.getDepartmentById);
router.post('/', verifyToken, departmentController.createDepartment);
router.put('/:id', verifyToken, departmentController.updateDepartment);
router.delete('/:id', verifyToken, departmentController.deleteDepartment);

export default router;
