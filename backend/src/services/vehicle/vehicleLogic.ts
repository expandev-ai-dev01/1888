/**
 * @summary
 * Vehicle business logic for catalog operations.
 * Handles filtering, sorting, and pagination of vehicle data.
 *
 * @module services/vehicle/vehicleLogic
 */

import { VehicleListParams, VehicleListResponse, Vehicle } from './vehicleTypes';

/**
 * @remarks
 * In-memory vehicle storage (no database persistence)
 */
export let vehicles: Vehicle[] = [
  {
    id: '1',
    model: 'Civic',
    brand: 'Honda',
    year: 2023,
    price: 135000.0,
    mainImage: 'https://example.com/civic.jpg',
    mileage: 15000,
    transmission: 'Automático',
  },
  {
    id: '2',
    model: 'Corolla',
    brand: 'Toyota',
    year: 2022,
    price: 128000.0,
    mainImage: 'https://example.com/corolla.jpg',
    mileage: 25000,
    transmission: 'CVT',
  },
  {
    id: '3',
    model: 'Onix',
    brand: 'Chevrolet',
    year: 2024,
    price: 85000.0,
    mainImage: 'https://example.com/onix.jpg',
    mileage: 5000,
    transmission: 'Manual',
  },
  {
    id: '4',
    model: 'HB20',
    brand: 'Hyundai',
    year: 2023,
    price: 78000.0,
    mainImage: 'https://example.com/hb20.jpg',
    mileage: 12000,
    transmission: 'Automático',
  },
  {
    id: '5',
    model: 'Gol',
    brand: 'Volkswagen',
    year: 2021,
    price: 65000.0,
    mainImage: 'https://example.com/gol.jpg',
    mileage: 35000,
    transmission: 'Manual',
  },
];

/**
 * @summary
 * Lists vehicles with filtering, sorting, and pagination
 *
 * @function vehicleList
 * @module services/vehicle/vehicleLogic
 *
 * @param {VehicleListParams} params - Listing parameters
 *
 * @returns {Promise<VehicleListResponse>} Paginated vehicle list
 */
export async function vehicleList(params: VehicleListParams): Promise<VehicleListResponse> {
  let filteredVehicles = [...vehicles];

  /**
   * @rule {fn-vehicle-filtering} Apply filters
   */
  if (params.brands) {
    const brandList = params.brands.split(',').map((b) => b.trim());
    filteredVehicles = filteredVehicles.filter((v) => brandList.includes(v.brand));
  }

  if (params.models) {
    const modelList = params.models.split(',').map((m) => m.trim());
    filteredVehicles = filteredVehicles.filter((v) => modelList.includes(v.model));
  }

  if (params.yearMin) {
    filteredVehicles = filteredVehicles.filter((v) => v.year >= params.yearMin!);
  }

  if (params.yearMax) {
    filteredVehicles = filteredVehicles.filter((v) => v.year <= params.yearMax!);
  }

  if (params.priceMin) {
    filteredVehicles = filteredVehicles.filter((v) => v.price >= params.priceMin!);
  }

  if (params.priceMax) {
    filteredVehicles = filteredVehicles.filter((v) => v.price <= params.priceMax!);
  }

  if (params.transmissions) {
    const transmissionList = params.transmissions.split(',').map((t) => t.trim());
    filteredVehicles = filteredVehicles.filter(
      (v) => v.transmission && transmissionList.includes(v.transmission)
    );
  }

  /**
   * @rule {fn-vehicle-sorting} Apply sorting
   */
  switch (params.sortBy) {
    case 'price_asc':
      filteredVehicles.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredVehicles.sort((a, b) => b.price - a.price);
      break;
    case 'year_newest':
      filteredVehicles.sort((a, b) => b.year - a.year);
      break;
    case 'year_oldest':
      filteredVehicles.sort((a, b) => a.year - b.year);
      break;
    case 'model_az':
      filteredVehicles.sort((a, b) => a.model.localeCompare(b.model));
      break;
    case 'model_za':
      filteredVehicles.sort((a, b) => b.model.localeCompare(a.model));
      break;
    case 'relevance':
    default:
      break;
  }

  /**
   * @rule {fn-vehicle-pagination} Apply pagination
   */
  const total = filteredVehicles.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const currentPage = Math.min(params.page, totalPages || 1);
  const startIndex = (currentPage - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  return {
    vehicles: paginatedVehicles,
    pagination: {
      currentPage,
      pageSize: params.pageSize,
      totalItems: total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    },
    filters: {
      availableBrands: [...new Set(vehicles.map((v) => v.brand))].sort(),
      availableModels: [...new Set(vehicles.map((v) => v.model))].sort(),
      availableTransmissions: [
        ...new Set(vehicles.map((v) => v.transmission).filter(Boolean)),
      ].sort() as string[],
      yearRange: {
        min: Math.min(...vehicles.map((v) => v.year)),
        max: Math.max(...vehicles.map((v) => v.year)),
      },
      priceRange: {
        min: Math.min(...vehicles.map((v) => v.price)),
        max: Math.max(...vehicles.map((v) => v.price)),
      },
    },
  };
}
