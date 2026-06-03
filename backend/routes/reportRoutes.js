// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

router.get('/on-leave', verifyToken, reportController.getOnLeaveReport);
router.get('/status-summary', verifyToken, reportController.getStatusSummary);

module.exports = router;
