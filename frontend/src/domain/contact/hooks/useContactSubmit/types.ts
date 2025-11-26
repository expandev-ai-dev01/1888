export interface UseContactSubmitOptions {
  onSuccess?: (protocol: string) => void;
  onError?: (error: Error) => void;
}
