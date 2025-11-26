import type { VehicleFilters } from '../../types/vehicle';

export interface VehicleFiltersProps {
  filters: VehicleFilters;
  availableBrands?: string[];
  availableModels?: string[];
  availableTransmissions?: string[];
  yearRange?: { min: number; max: number };
  priceRange?: { min: number; max: number };
  onFiltersChange: (filters: VehicleFilters) => void;
  onApply: () => void;
  onClear: () => void;
}
