import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';
import type { UseVehicleListOptions } from './types';

export const useVehicleList = (options: UseVehicleListOptions = {}) => {
  const { filters, enabled = true } = options;

  const queryKey = ['vehicles', filters];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => vehicleService.list(filters),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    vehicles: data?.data ?? [],
    pagination: data?.pagination,
    availableFilters: data?.filters,
    isLoading,
    isError,
    error,
    refetch,
  };
};
