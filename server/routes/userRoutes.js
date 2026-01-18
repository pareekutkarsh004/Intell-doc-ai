/**
 * USER ROUTES
 * Maps the authentication endpoints to the User Controller.
 */

import express from 'express';
import { syncUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * ROUTE: POST /api/users/sync
 * Purpose: Takes the Firebase token from the frontend and syncs the user with MongoDB.
 */

router.post('/sync', syncUser);

export default router;