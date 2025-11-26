import { authenticatedClient } from '@/core/lib/api';
import type { VehicleListParams, VehicleListResponse } from '../types/vehicle';

/**
 * @service Vehicle Service
 * @domain vehicle
 * @type REST
 */
export const vehicleService = {
  /**
   * Lists vehicles with filtering, sorting, and pagination
   */
  async list(params?: VehicleListParams): Promise<VehicleListResponse> {
    const { data } = await authenticatedClient.get<{ data: VehicleListResponse }>('/vehicle', {
      params,
    });
    return data.data;
  },
};
