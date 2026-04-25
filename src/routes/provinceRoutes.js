const express = require('express');
const router = express.Router();
const { getProvinces, getProvince, createProvince, updateProvince, deleteProvince } = require('../controllers/provinceController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: Sri Lanka province management
 */

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Get all 9 provinces of Sri Lanka
 *     tags: [Provinces]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Records per page
 *     responses:
 *       200:
 *         description: List of provinces
 *   post:
 *     summary: Create a province (HQ Admin only)
 *     tags: [Provinces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Western Province
 *               code:
 *                 type: string
 *                 example: WP
 *     responses:
 *       201:
 *         description: Province created
 */
router.route('/')
  .get(protect, getProvinces)
  .post(protect, authorize('HQ_ADMIN'), createProvince);

/**
 * @swagger
 * /provinces/{id}:
 *   get:
 *     summary: Get a single province by ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Province details
 *       404:
 *         description: Province not found
 *   put:
 *     summary: Update a province (HQ Admin only)
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Province updated
 *   delete:
 *     summary: Delete a province (HQ Admin only)
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Province deleted
 */
router.route('/:id')
  .get(protect, getProvince)
  .put(protect, authorize('HQ_ADMIN'), updateProvince)
  .delete(protect, authorize('HQ_ADMIN'), deleteProvince);

module.exports = router;