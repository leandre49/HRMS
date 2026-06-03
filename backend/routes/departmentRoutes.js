// backend/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, departmentController.getAllDepartments);
router.get('/:id', verifyToken, departmentController.getDepartmentById);
router.post('/', verifyToken, departmentController.createDepartment);
router.put('/:id', verifyToken, departmentController.updateDepartment);
router.delete('/:id', verifyToken, departmentController.deleteDepartment);

module.exports = router;
