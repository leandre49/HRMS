// backend/routes/positionRoutes.js
const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, positionController.getAllPositions);
router.get('/:id', verifyToken, positionController.getPositionById);
router.post('/', verifyToken, positionController.createPosition);
router.put('/:id', verifyToken, positionController.updatePosition);
router.delete('/:id', verifyToken, positionController.deletePosition);

module.exports = router;
