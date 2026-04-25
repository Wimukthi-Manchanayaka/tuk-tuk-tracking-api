const express = require('express');
const router = express.Router();
const { getStations, getStation, createStation, updateStation, deleteStation } = require('../controllers/stationController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Police Stations
 *   description: Police station management
 */

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Get all police stations (filter by province or district)
 *     tags: [Police Stations]
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
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
 *         description: List of police stations
 *   post:
 *     summary: Create a police station (HQ Admin only)
 *     tags: [Police Stations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, district, province]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Colombo Fort Police Station
 *               district:
 *                 type: string
 *               province:
 *                 type: string
 *               address:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Station created
 */
router.route('/')
  .get(protect, getStations)
  .post(protect, authorize('HQ_ADMIN'), createStation);

/**
 * @swagger
 * /stations/{id}:
 *   get:
 *     summary: Get a single police station
 *     tags: [Police Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station details
 *   put:
 *     summary: Update a police station (HQ Admin only)
 *     tags: [Police Stations]
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
 *         description: Station updated
 *   delete:
 *     summary: Delete a police station (HQ Admin only)
 *     tags: [Police Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station deleted
 */
router.route('/:id')
  .get(protect, getStation)
  .put(protect, authorize('HQ_ADMIN'), updateStation)
  .delete(protect, authorize('HQ_ADMIN'), deleteStation);

module.exports = router;