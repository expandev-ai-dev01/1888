/**
 * @summary
 * Type definitions for vehicle service operations.
 *
 * @module services/vehicle/vehicleTypes
 */

/**
 * @interface Vehicle
 * @description Represents a vehicle entity
 *
 * @property {string} id - Unique vehicle identifier
 * @property {string} model - Vehicle model name
 * @property {string} brand - Vehicle brand/manufacturer
 * @property {number} year - Year of manufacture
 * @property {number} price - Vehicle price in BRL
 * @property {string} mainImage - URL of main vehicle image
 * @property {number} mileage - Vehicle mileage in kilometers (optional)
 * @property {string} transmission - Transmission type (optional)
 */
export interface Vehicle {
  id: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  mainImage: string;
  mileage?: number;
  transmission?: string;
}

/**
 * @interface VehicleListParams
 * @description Parameters for vehicle listing with filters
 *
 * @property {number} page - Current page number
 * @property {number} pageSize - Items per page
 * @property {string} sortBy - Sort criteria
 * @property {string} brands - Comma-separated brand names (optional)
 * @property {string} models - Comma-separated model names (optional)
 * @property {number} yearMin - Minimum year filter (optional)
 * @property {number} yearMax - Maximum year filter (optional)
 * @property {number} priceMin - Minimum price filter (optional)
 * @property {number} priceMax - Maximum price filter (optional)
 * @property {string} transmissions - Comma-separated transmission types (optional)
 */
export interface VehicleListParams {
  page: number;
  pageSize: number;
  sortBy:
    | 'relevance'
    | 'price_asc'
    | 'price_desc'
    | 'year_newest'
    | 'year_oldest'
    | 'model_az'
    | 'model_za';
  brands?: string;
  models?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  transmissions?: string;
}

/**
 * @interface PaginationInfo
 * @description Pagination metadata
 *
 * @property {number} currentPage - Current page number
 * @property {number} pageSize - Items per page
 * @property {number} totalItems - Total number of items
 * @property {number} totalPages - Total number of pages
 * @property {boolean} hasNext - Whether next page exists
 * @property {boolean} hasPrevious - Whether previous page exists
 */
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * @interface FilterOptions
 * @description Available filter options
 *
 * @property {string[]} availableBrands - List of available brands
 * @property {string[]} availableModels - List of available models
 * @property {string[]} availableTransmissions - List of available transmission types
 * @property {object} yearRange - Year range
 * @property {number} yearRange.min - Minimum year
 * @property {number} yearRange.max - Maximum year
 * @property {object} priceRange - Price range
 * @property {number} priceRange.min - Minimum price
 * @property {number} priceRange.max - Maximum price
 */
export interface FilterOptions {
  availableBrands: string[];
  availableModels: string[];
  availableTransmissions: string[];
  yearRange: {
    min: number;
    max: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

/**
 * @interface VehicleListResponse
 * @description Response structure for vehicle listing
 *
 * @property {Vehicle[]} vehicles - Array of vehicles
 * @property {PaginationInfo} pagination - Pagination information
 * @property {FilterOptions} filters - Available filter options
 */
export interface VehicleListResponse {
  vehicles: Vehicle[];
  pagination: PaginationInfo;
  filters: FilterOptions;
}
