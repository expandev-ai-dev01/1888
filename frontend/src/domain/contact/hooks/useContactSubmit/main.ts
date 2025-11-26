import { useMutation } from '@tanstack/react-query';
import { contactService } from '../../services/contactService';
import type { ContactFormOutput } from '../../types/contact';
import type { UseContactSubmitOptions } from './types';

export const useContactSubmit = (options: UseContactSubmitOptions = {}) => {
  const { onSuccess, onError } = options;

  const mutation = useMutation({
    mutationFn: (data: ContactFormOutput) => contactService.submit(data),
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data.protocol);
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      }
    },
  });

  return {
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};
