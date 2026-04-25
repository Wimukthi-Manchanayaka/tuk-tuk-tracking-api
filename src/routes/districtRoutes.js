const express = require('express');
const router = express.Router();
const { getDistricts, getDistrict, createDistrict, updateDistrict, deleteDistrict } = require('../controllers/districtController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: Sri Lanka district management
 */

/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Get all districts (filter by province using ?province=ID)
 *     tags: [Districts]
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by Province ID
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
 *         description: List of districts
 *   post:
 *     summary: Create a district (HQ Admin only)
 *     tags: [Districts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, province]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Colombo District
 *               code:
 *                 type: string
 *                 example: COL
 *               province:
 *                 type: string
 *                 example: 60a1b2c3d4e5f6789abcdef0
 *     responses:
 *       201:
 *         description: District created
 */
router.route('/')
  .get(protect, getDistricts)
  .post(protect, authorize('HQ_ADMIN'), createDistrict);

/**
 * @swagger
 * /districts/{id}:
 *   get:
 *     summary: Get a single district
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District details
 *   put:
 *     summary: Update a district (HQ Admin only)
 *     tags: [Districts]
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
 *         description: District updated
 *   delete:
 *     summary: Delete a district (HQ Admin only)
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District deleted
 */
router.route('/:id')
  .get(protect, getDistrict)
  .put(protect, authorize('HQ_ADMIN'), updateDistrict)
  .delete(protect, authorize('HQ_ADMIN'), deleteDistrict);

module.exports = router;