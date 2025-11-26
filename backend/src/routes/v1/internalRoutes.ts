/**
 * @summary
 * Internal API routes configuration for authenticated endpoints.
 * Handles all authenticated user operations and protected resources.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as vehicleController from '@/api/v1/internal/vehicle/controller';
import * as contactController from '@/api/v1/internal/contact/controller';

const router = Router();

/**
 * @rule {be-vehicle-routes}
 * Vehicle listing routes
 */
router.get('/vehicle', vehicleController.listHandler);

/**
 * @rule {be-contact-routes}
 * Contact form submission routes
 */
router.post('/contact', contactController.postHandler);

export default router;
