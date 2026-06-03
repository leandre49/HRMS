import express from 'express';
const router = express.Router();
import * as employeeController from '../controllers/employeeController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/', verifyToken, employeeController.getAllEmployees);
router.get('/:id', verifyToken, employeeController.getEmployeeById);
router.post('/', verifyToken, employeeController.createEmployee);
router.put('/:id', verifyToken, employeeController.updateEmployee);
router.delete('/:id', verifyToken, employeeController.deleteEmployee);

export default router;
