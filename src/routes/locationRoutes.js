const express = require('express');
const router = express.Router();
const { postPing, getLastLocation, getLocationHistory, getLiveLocations } = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/auth');
const { validatePing } = require('../middleware/validators');

/**
 * @swagger
 * tags:
 *   name: Location Tracking
 *   description: GPS location pings and tracking features
 */

/**
 * @swagger
 * /locations/ping:
 *   post:
 *     summary: Submit GPS location ping (Device only)
 *     tags: [Location Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude]
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 6.9271
 *                 description: Must be between 5.9 and 9.9 (Sri Lanka)
 *               longitude:
 *                 type: number
 *                 example: 79.8612
 *                 description: Must be between 79.7 and 81.9 (Sri Lanka)
 *               speed:
 *                 type: number
 *                 example: 25.5
 *               heading:
 *                 type: number
 *                 example: 180
 *               vehicleId:
 *                 type: string
 *                 description: Vehicle MongoDB ID
 *     responses:
 *       201:
 *         description: Ping recorded successfully
 *       400:
 *         description: Invalid coordinates (outside Sri Lanka)
 *       403:
 *         description: Vehicle is inactive
 */
router.post('/ping', protect, authorize('DEVICE', 'HQ_ADMIN'), validatePing, postPing);

/**
 * @swagger
 * /locations/live:
 *   get:
 *     summary: Get live locations of all active vehicles (overview map)
 *     tags: [Location Tracking]
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
 *     responses:
 *       200:
 *         description: Live locations of all active vehicles
 */
router.get('/live', protect, getLiveLocations);

/**
 * @swagger
 * /locations/vehicles/{vehicleId}/last:
 *   get:
 *     summary: Get last known location of a specific vehicle
 *     tags: [Location Tracking]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle MongoDB ID
 *     responses:
 *       200:
 *         description: Last known location with vehicle details
 *       404:
 *         description: Vehicle or location not found
 */
router.get('/vehicles/:vehicleId/last', protect, getLastLocation);

/**
 * @swagger
 * /locations/vehicles/{vehicleId}/history:
 *   get:
 *     summary: Get location history for investigation (time window filter)
 *     tags: [Location Tracking]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2024-04-01T00:00:00Z
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2024-04-07T23:59:59Z
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
 *         description: Location history with pagination
 */
router.get('/vehicles/:vehicleId/history', protect, getLocationHistory);

module.exports = router;