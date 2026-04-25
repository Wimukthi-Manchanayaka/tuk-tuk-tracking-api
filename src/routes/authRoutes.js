const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { validateLogin, validateRegister } = require('../middleware/validators');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User login and registration
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to get JWT token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@police.lk
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful - returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user (HQ Admin only)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Officer Silva
 *               email:
 *                 type: string
 *                 example: silva@police.lk
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [HQ_ADMIN, PROVINCIAL, STATION, DEVICE]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Access denied - HQ Admin only
 */
router.post('/register', protect, authorize('HQ_ADMIN'), validateRegister, register);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user details
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Not authenticated
 */
router.get('/me', protect, getMe);

module.exports = router;