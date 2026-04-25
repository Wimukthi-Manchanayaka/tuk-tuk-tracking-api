const express = require('express');
const router = express.Router();
const { getVehicles, getVehicle, createVehicle, updateVehicle, deactivateVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');
const { validateVehicle } = require('../middleware/validators');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Tuk-tuk vehicle registration and management
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all registered tuk-tuks (with filters)
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province ID
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district ID
 *       - in: query
 *         name: station
 *         schema:
 *           type: string
 *         description: Filter by station ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of vehicles
 *   post:
 *     summary: Register a new tuk-tuk (Provincial or HQ Admin)
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registrationNumber, deviceId, driverName, driverNIC, province, district, station]
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: WP-AB-1234
 *               deviceId:
 *                 type: string
 *                 example: DEV-001
 *               driverName:
 *                 type: string
 *                 example: Kamal Perera
 *               driverNIC:
 *                 type: string
 *                 example: 901234567V
 *               driverPhone:
 *                 type: string
 *                 example: 0712345678
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               station:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle registered successfully
 */
router.route('/')
  .get(protect, getVehicles)
  .post(protect, authorize('HQ_ADMIN', 'PROVINCIAL'), validateVehicle, createVehicle);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get a single vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle details
 *   put:
 *     summary: Update a vehicle (Provincial or HQ Admin)
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Vehicle updated
 */
router.route('/:id')
  .get(protect, getVehicle)
  .put(protect, authorize('HQ_ADMIN', 'PROVINCIAL'), updateVehicle);

/**
 * @swagger
 * /vehicles/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a vehicle (preserves location history)
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle deactivated
 */
router.patch('/:id/deactivate', protect, authorize('HQ_ADMIN', 'PROVINCIAL'), deactivateVehicle);

module.exports = router;