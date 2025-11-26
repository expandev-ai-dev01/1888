/**
 * @summary
 * Type definitions for contact service operations.
 *
 * @module services/contact/contactTypes
 */

/**
 * @interface ContactCreateParams
 * @description Parameters for creating a contact form submission
 *
 * @property {string} nomeCompleto - Full name of the user
 * @property {string} email - Email address
 * @property {string} telefone - Phone number
 * @property {string} preferenciaContato - Preferred contact method
 * @property {string} melhorHorario - Best time to contact
 * @property {string} idVeiculo - Vehicle identifier
 * @property {string} modeloVeiculo - Vehicle model
 * @property {string} assunto - Subject of inquiry
 * @property {string} mensagem - Detailed message
 * @property {boolean} financiamento - Interest in financing
 * @property {boolean} termosPrivacidade - Privacy terms acceptance
 * @property {boolean} receberNovidades - Newsletter subscription
 * @property {string} ipUsuario - User IP address
 */
export interface ContactCreateParams {
  nomeCompleto: string;
  email: string;
  telefone: string;
  preferenciaContato: 'Telefone' | 'E-mail' | 'WhatsApp';
  melhorHorario: 'Manhã' | 'Tarde' | 'Noite' | 'Qualquer horário';
  idVeiculo: string;
  modeloVeiculo: string;
  assunto:
    | 'Informações gerais'
    | 'Agendamento de test drive'
    | 'Negociação de preço'
    | 'Financiamento'
    | 'Outro';
  mensagem: string;
  financiamento: boolean;
  termosPrivacidade: boolean;
  receberNovidades: boolean;
  ipUsuario: string;
}

/**
 * @interface Contact
 * @description Represents a contact form submission
 *
 * @property {string} idContato - Unique contact identifier
 * @property {string} protocolo - Protocol number for tracking
 * @property {string} nomeCompleto - Full name
 * @property {string} email - Email address
 * @property {string} telefone - Phone number
 * @property {string} preferenciaContato - Preferred contact method
 * @property {string} melhorHorario - Best time to contact
 * @property {string} idVeiculo - Vehicle identifier
 * @property {string} modeloVeiculo - Vehicle model
 * @property {string} assunto - Subject of inquiry
 * @property {string} mensagem - Detailed message
 * @property {boolean} financiamento - Interest in financing
 * @property {boolean} receberNovidades - Newsletter subscription
 * @property {string} status - Contact status
 * @property {Date} dataEnvio - Submission date
 * @property {string} ipUsuario - User IP address
 */
export interface Contact {
  idContato: string;
  protocolo: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  preferenciaContato: string;
  melhorHorario: string;
  idVeiculo: string;
  modeloVeiculo: string;
  assunto: string;
  mensagem: string;
  financiamento: boolean;
  receberNovidades: boolean;
  status: 'Novo' | 'Em atendimento' | 'Concluído' | 'Cancelado';
  dataEnvio: Date;
  ipUsuario: string;
}

/**
 * @interface ContactCreateResponse
 * @description Response structure for contact creation
 *
 * @property {string} idContato - Contact identifier
 * @property {string} protocolo - Protocol number
 * @property {string} mensagemConfirmacao - Confirmation message
 * @property {string} prazoResposta - Expected response time
 */
export interface ContactCreateResponse {
  idContato: string;
  protocolo: string;
  mensagemConfirmacao: string;
  prazoResposta: string;
}
