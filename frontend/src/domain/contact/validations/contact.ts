import { z } from 'zod';

const contactChannels = ['Telefone', 'E-mail', 'WhatsApp'] as const;
const subjects = [
  'Informações gerais',
  'Agendamento de test drive',
  'Negociação de preço',
  'Financiamento',
  'Outro',
] as const;
const bestTimes = ['Manhã', 'Tarde', 'Noite', 'Qualquer horário'] as const;

export const contactSchema = z.object({
  nomeCompleto: z
    .string('Nome é obrigatório')
    .min(3, 'O nome deve conter pelo menos 3 caracteres')
    .max(100, 'O nome deve conter no máximo 100 caracteres')
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: 'Por favor, informe seu nome completo (nome e sobrenome)',
    }),
  email: z
    .string('E-mail é obrigatório')
    .email('Por favor, informe um endereço de e-mail válido no formato usuario@dominio.com')
    .max(100, 'O e-mail deve conter no máximo 100 caracteres'),
  telefone: z
    .string('Telefone é obrigatório')
    .min(10, 'O telefone deve conter pelo menos 10 dígitos incluindo DDD')
    .regex(
      /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
      'Por favor, informe um número de telefone válido com DDD'
    ),
  preferenciaContato: z.enum(contactChannels, 'Selecione um canal de contato'),
  melhorHorario: z.enum(bestTimes, 'Selecione um horário').default('Qualquer horário'),
  idVeiculo: z.string('ID do veículo é obrigatório').min(1, 'ID do veículo é obrigatório'),
  modeloVeiculo: z
    .string('Modelo do veículo é obrigatório')
    .min(1, 'Modelo do veículo é obrigatório'),
  assunto: z.enum(subjects, 'Selecione um assunto'),
  mensagem: z
    .string('Mensagem é obrigatória')
    .min(10, 'Por favor, forneça mais detalhes em sua mensagem (mínimo 10 caracteres)')
    .max(1000, 'Sua mensagem excedeu o limite de 1000 caracteres'),
  financiamento: z.boolean().default(false),
  termosPrivacidade: z.boolean().refine((val) => val === true, {
    message: 'É necessário concordar com os termos de privacidade para prosseguir',
  }),
  receberNovidades: z.boolean().default(false),
});
