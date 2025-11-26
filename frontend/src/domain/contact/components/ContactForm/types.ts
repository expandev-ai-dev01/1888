export interface ContactFormProps {
  vehicleId: string;
  vehicleModel: string;
  onSuccess?: (protocol: string) => void;
  onCancel?: () => void;
}
