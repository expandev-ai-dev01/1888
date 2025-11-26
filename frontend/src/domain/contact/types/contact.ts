import { z } from 'zod';
import { contactSchema } from '../validations/contact';

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormOutput = z.output<typeof contactSchema>;

export interface ContactSubmitResponse {
  success: boolean;
  protocol: string;
  message: string;
}
