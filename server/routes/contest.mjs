/**
 * @swagger
 * components:
 *  schemas:
 *   Contest:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       id:
 *         type: string
 *         description: The auto-generated id of the contest using its name
 *       name:
 *         type: string
 *         description: The name of the contest
 *       description:
 *         type: string
 *         description: The HTML description of the contest
 *       start_date:
 *         type: datetime
 *         description: The contest starting date (UTC +0)
 *       end_date:
 *         type: datetime
 *         description: The contest starting date (UTC +0)
 *     example:
 *       id: ssc3
 *       name: Suno Song Contest 3
 *       description: ...
 *       start_date: 2024-07-09T12:00:00
 *       end_date: 2024-07-12T12:00:00
 *   CreateContestPayload:
 *     type: object
 *     required:
 *       - name
 *       - start_date
 *       - end_date
 *     properties:
 *       name:
 *         type: string
 *         description: The name of the contest
 *       description:
 *         type: string
 *         description: The HTML description of the contest
 *       start_date:
 *         type: datetime
 *         description: The contest starting date (UTC +0)
 *       end_date:
 *         type: datetime
 *         description: The contest starting date (UTC +0)
 *     example:
 *       name: Suno Song Contest 3
 *       description: ...
 *       start_date: 2024-07-09T12:00:00
 *       end_date: 2024-07-12T12:00:00
 */

/**
 * @swagger
 * tags:
 *   name: Contests
 *   description: The contests API endpoints
 * /contest:
 *   get:
 *     summary: Get all contests
 *     tags: [Contests]
 *     responses:
 *       200:
 *         description: The contests response
 *         contens:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contest'
 *       404:
 *         description: No contests were found
 *       500:
 *         description: Someting bad happened, more info in response body
 *   post:
 *     summary: Creates a new contest
 *     tags: [Contests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContestPayload'
 *     responses:
 *       200:
 *         description: The created contest
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contest'
 *       400:
 *         description: Missing one or more required payload fields
 *       500:
 *         description: Someting bad happened, more info in response body
 * /contest/{id}:
 *   get:
 *     summary: Get a contest by id
 *     tags: [Contests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contest id
 *     responses:
 *       200:
 *         description: The contest response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contest'
 *       400:
 *         description: Missing id parameter
 *       404:
 *         description: The contest was not found
 *       500:
 *         description: Someting bad happened, more info in response body
 */

import express from "express";
import { addOne, getMore, getOne } from "../controllers/contest.mjs";

const router = express.Router();

router.get("/", getMore);
router.get("/:id", getOne);
router.post("/", addOne);

export default router;
