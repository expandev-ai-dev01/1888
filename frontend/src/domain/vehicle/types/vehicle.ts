export interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  ano: number;
  preco: number;
  imagem_principal: string;
  quilometragem?: number;
  cambio?: string;
}

export interface VehicleListParams {
  page?: number;
  pageSize?: number;
  sortBy?:
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

export interface VehicleListResponse {
  data: Vehicle[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    availableBrands: string[];
    availableModels: string[];
    availableTransmissions: string[];
    yearRange: { min: number; max: number };
    priceRange: { min: number; max: number };
  };
}

export interface VehicleFilters {
  brands: string[];
  models: string[];
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  transmissions: string[];
}
