/**
 * @summary
 * Contact business logic for form submission operations.
 * Handles contact creation, validation, rate limiting, and email notifications.
 *
 * @module services/contact/contactLogic
 */

import { ContactCreateParams, ContactCreateResponse, Contact } from './contactTypes';
import { vehicles } from '@/services/vehicle/vehicleLogic';

/**
 * @remarks
 * In-memory contact storage (no database persistence)
 */
let contacts: Contact[] = [];

/**
 * @remarks
 * Rate limiting storage: IP -> submission timestamps
 */
const rateLimitMap = new Map<string, number[]>();

/**
 * @summary
 * Generates a unique protocol number
 *
 * @function generateProtocol
 * @module services/contact/contactLogic
 *
 * @returns {string} Protocol number in format YYYYMMDDNNNNN
 */
function generateProtocol(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequence = String(contacts.length + 1).padStart(5, '0');
  return `${year}${month}${day}${sequence}`;
}

/**
 * @summary
 * Checks rate limit for IP address
 *
 * @function checkRateLimit
 * @module services/contact/contactLogic
 *
 * @param {string} ipAddress - User IP address
 *
 * @returns {boolean} True if rate limit not exceeded
 */
function checkRateLimit(ipAddress: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 3;

  const timestamps = rateLimitMap.get(ipAddress) || [];
  const recentTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return false;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ipAddress, recentTimestamps);
  return true;
}

/**
 * @summary
 * Simulates sending confirmation email to user
 *
 * @function sendConfirmationEmail
 * @module services/contact/contactLogic
 *
 * @param {Contact} contact - Contact data
 *
 * @returns {Promise<void>}
 */
async function sendConfirmationEmail(contact: Contact): Promise<void> {
  /**
   * @rule {fn-email-confirmation}
   * Simulate email sending with console log
   */
  console.log('=== EMAIL DE CONFIRMAÇÃO ===');
  console.log(`Para: ${contact.email}`);
  console.log(`Assunto: Confirmação de contato - ${contact.modeloVeiculo}`);
  console.log(`Protocolo: ${contact.protocolo}`);
  console.log(`Mensagem: Recebemos seu contato sobre o veículo ${contact.modeloVeiculo}.`);
  console.log(`Prazo de resposta: 24 horas úteis`);
  console.log('============================');
}

/**
 * @summary
 * Simulates sending notification email to sales team
 *
 * @function sendNotificationEmail
 * @module services/contact/contactLogic
 *
 * @param {Contact} contact - Contact data
 *
 * @returns {Promise<void>}
 */
async function sendNotificationEmail(contact: Contact): Promise<void> {
  /**
   * @rule {fn-email-notification}
   * Simulate email sending with console log
   */
  console.log('=== EMAIL DE NOTIFICAÇÃO (EQUIPE) ===');
  console.log(`Assunto: Novo contato - ${contact.modeloVeiculo}`);
  console.log(`Nome: ${contact.nomeCompleto}`);
  console.log(`Email: ${contact.email}`);
  console.log(`Telefone: ${contact.telefone}`);
  console.log(`Veículo: ${contact.modeloVeiculo}`);
  console.log(`Assunto: ${contact.assunto}`);
  console.log(`Mensagem: ${contact.mensagem}`);
  console.log(`Data: ${contact.dataEnvio.toISOString()}`);
  console.log('=====================================');
}

/**
 * @summary
 * Creates a new contact form submission
 *
 * @function contactCreate
 * @module services/contact/contactLogic
 *
 * @param {ContactCreateParams} params - Contact creation parameters
 *
 * @returns {Promise<ContactCreateResponse>} Contact creation result
 *
 * @throws {Error} veiculoNaoEncontrado - Vehicle not found
 * @throws {Error} rateLimitExceeded - Rate limit exceeded
 */
export async function contactCreate(params: ContactCreateParams): Promise<ContactCreateResponse> {
  /**
   * @validation Check rate limit
   */
  if (!checkRateLimit(params.ipUsuario)) {
    throw new Error('rateLimitExceeded');
  }

  /**
   * @validation Verify vehicle exists
   */
  const vehicleExists = vehicles.some((v) => v.id === params.idVeiculo);
  if (!vehicleExists) {
    throw new Error('veiculoNaoEncontrado');
  }

  /**
   * @rule {fn-contact-creation}
   * Create contact record
   */
  const idContato = `CNT${Date.now()}`;
  const protocolo = generateProtocol();
  const dataEnvio = new Date();

  const contact: Contact = {
    idContato,
    protocolo,
    nomeCompleto: params.nomeCompleto,
    email: params.email,
    telefone: params.telefone,
    preferenciaContato: params.preferenciaContato,
    melhorHorario: params.melhorHorario,
    idVeiculo: params.idVeiculo,
    modeloVeiculo: params.modeloVeiculo,
    assunto: params.assunto,
    mensagem: params.mensagem,
    financiamento: params.financiamento,
    receberNovidades: params.receberNovidades,
    status: 'Novo',
    dataEnvio,
    ipUsuario: params.ipUsuario,
  };

  contacts.push(contact);

  /**
   * @rule {fn-email-sending}
   * Send confirmation and notification emails
   */
  await Promise.all([sendConfirmationEmail(contact), sendNotificationEmail(contact)]);

  return {
    idContato,
    protocolo,
    mensagemConfirmacao: `Obrigado pelo seu contato! Recebemos sua mensagem sobre o ${params.modeloVeiculo}. Seu número de protocolo é ${protocolo}.`,
    prazoResposta: '24 horas úteis',
  };
}

/**
 * @summary
 * Export contacts for testing/debugging
 */
export { contacts };
