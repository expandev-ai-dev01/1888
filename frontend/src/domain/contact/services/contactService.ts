import { authenticatedClient } from '@/core/lib/api';
import type { ContactFormOutput, ContactSubmitResponse } from '../types/contact';

/**
 * @service Contact Service
 * @domain contact
 * @type REST
 */
export const contactService = {
  /**
   * Submits contact form for vehicle inquiry
   */
  async submit(data: ContactFormOutput): Promise<ContactSubmitResponse> {
    const { data: response } = await authenticatedClient.post<{ data: ContactSubmitResponse }>(
      '/contact',
      data
    );
    return response.data;
  },
};
