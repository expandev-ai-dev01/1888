import type { Vehicle } from '../../types/vehicle';

export interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: (vehicleId: string) => void;
}
