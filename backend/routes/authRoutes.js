// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;
