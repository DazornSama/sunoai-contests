/**
 * @swagger
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - id
 *         - contest_id
 *         - title
 *         - prompt
 *         - author
 *         - cover
 *         - country
 *       properties:
 *         id:
 *           type: string
 *           description: The Suno-generated id for the song
 *         contest_id:
 *           type: string
 *           description: The contest related id
 *         title:
 *           type: string
 *           description: The title of the song
 *         prompt:
 *           type: string
 *           description: The style prompt used for the song
 *         author:
 *           type: string
 *           description: The author of the song
 *         cover:
 *           type: string
 *           description: The cover URL of the song
 *         country:
 *           type: string
 *           description: The i18n-ISO country code
 *       example:
 *         id: '4bddce0f-adb7-4bad-b187-99fad19e9029'
 *         contest_id: ssc4
 *         title: We are ninjas [VIC1]
 *         prompt: '[brostep dubstep progressive], [raw razor-sharp bassline], [taiko kick drums], [raw fx], chaotic, allarmant, melancholic'
 *         author: Dazorn
 *         cover: 'https://cdn1.suno.ai/4bddce0f-adb7-4bad-b187-99fad19e9029_49622a80.png'
 *         country: IT
 *     CreateSongPayload:
 *       type: object
 *       required:
 *         - id
 *         - contest_id
 *         - title
 *         - prompt
 *         - author
 *         - cover
 *         - country
 *       properties:
 *         id:
 *           type: string
 *           description: The Suno-generated id for the song
 *         contest_id:
 *           type: string
 *           description: The contest related id
 *         title:
 *           type: string
 *           description: The title of the song
 *         prompt:
 *           type: string
 *           description: The style prompt used for the song
 *         author:
 *           type: string
 *           description: The author of the song
 *         cover:
 *           type: string
 *           description: The cover URL of the song
 *         country:
 *           type: string
 *           description: The i18n-ISO country code
 *       example:
 *         id: '4bddce0f-adb7-4bad-b187-99fad19e9029'
 *         contest_id: ssc4
 *         title: We are ninjas [VIC1]
 *         prompt: '[brostep dubstep progressive], [raw razor-sharp bassline], [taiko kick drums], [raw fx], chaotic, allarmant, melancholic'
 *         author: Dazorn
 *         cover: 'https://cdn1.suno.ai/4bddce0f-adb7-4bad-b187-99fad19e9029_49622a80.png'
 *         country: IT
 */

/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: The songs API endpoints
 * /song:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: The songs response
 *         contens:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       404:
 *         description: No songs were found
 *       500:
 *         description: Someting bad happened, more info in response body
 *   post:
 *     summary: Creates a new song
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSongPayload'
 *     responses:
 *       200:
 *         description: The created song
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Missing one or more required payload fields
 *       500:
 *         description: Someting bad happened, more info in response body
 * /song/{id}:
 *   get:
 *     summary: Get a song by id
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The song id
 *     responses:
 *       200:
 *         description: The song response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Missing id parameter
 *       404:
 *         description: The song was not found
 *       500:
 *         description: Someting bad happened, more info in response body
 *   put:
 *     summary: Update an existing song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The song id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSongPayload'
 *     responses:
 *       200:
 *         description: The updated song response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Missing id parameter or required payload fields
 *       404:
 *         description: The song was not found
 *       500:
 *         description: Someting bad happened, more info in response body
 *   delete:
 *     summary: Delete an existing song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The song id
 *     responses:
 *       200:
 *         description: The song has been deleted
 *       400:
 *         description: Missing id parameter
 *       404:
 *         description: The song was not found
 *       500:
 *         description: Someting bad happened, more info in response body
 */
