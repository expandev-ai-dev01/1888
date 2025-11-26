/**
 * @summary
 * Vehicle listing controller with filtering, sorting, and pagination.
 * Handles all vehicle catalog operations for the car listing feature.
 *
 * @module api/v1/internal/vehicle/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { vehicleList } from '@/services/vehicle';

/**
 * @validation Vehicle listing parameters
 */
const listParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(48).default(12),
  sortBy: z
    .enum([
      'relevance',
      'price_asc',
      'price_desc',
      'year_newest',
      'year_oldest',
      'model_az',
      'model_za',
    ])
    .default('relevance'),
  brands: z.string().optional(),
  models: z.string().optional(),
  yearMin: z.coerce.number().int().min(1900).optional(),
  yearMax: z.coerce.number().int().min(1900).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  transmissions: z.string().optional(),
});

/**
 * @summary
 * Lists vehicles with filtering, sorting, and pagination
 *
 * @function listHandler
 * @module api/v1/internal/vehicle/controller
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Promise<void>}
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Parse and validate query parameters
     */
    const params = listParamsSchema.parse(req.query);

    /**
     * @validation Validate year range consistency
     */
    if (params.yearMin && params.yearMax && params.yearMin > params.yearMax) {
      res.status(400).json(errorResponse('yearMinCannotBeGreaterThanYearMax', 'VALIDATION_ERROR'));
      return;
    }

    /**
     * @validation Validate price range consistency
     */
    if (params.priceMin && params.priceMax && params.priceMin > params.priceMax) {
      res
        .status(400)
        .json(errorResponse('priceMinCannotBeGreaterThanPriceMax', 'VALIDATION_ERROR'));
      return;
    }

    /**
     * @rule {fn-vehicle-listing} Execute vehicle listing with filters
     */
    const result = await vehicleList(params);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('invalidParameters', 'VALIDATION_ERROR', error.errors));
    } else {
      next(error);
    }
  }
}
