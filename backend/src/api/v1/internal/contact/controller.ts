/**
 * @summary
 * Contact form controller for vehicle inquiries.
 * Handles contact form submission with validation and email notifications.
 *
 * @module api/v1/internal/contact/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { contactCreate } from '@/services/contact';

/**
 * @validation Contact form submission parameters
 */
const createParamsSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, 'nomeDeveConterPeloMenosTresCaracteres')
    .max(100, 'nomeDeveConterNoMaximoCemCaracteres')
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: 'nomeDeveConterNomeESobrenome',
    }),
  email: z.string().email('emailInvalido').max(100, 'emailDeveConterNoMaximoCemCaracteres'),
  telefone: z
    .string()
    .min(10, 'telefoneDeveConterPeloMenosDezDigitos')
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'telefoneInvalido'),
  preferenciaContato: z.enum(['Telefone', 'E-mail', 'WhatsApp'], {
    errorMap: () => ({ message: 'preferenciaContatoInvalida' }),
  }),
  melhorHorario: z
    .enum(['Manhã', 'Tarde', 'Noite', 'Qualquer horário'])
    .default('Qualquer horário'),
  idVeiculo: z.string().min(1, 'idVeiculoObrigatorio'),
  modeloVeiculo: z.string().min(1, 'modeloVeiculoObrigatorio'),
  assunto: z.enum(
    [
      'Informações gerais',
      'Agendamento de test drive',
      'Negociação de preço',
      'Financiamento',
      'Outro',
    ],
    {
      errorMap: () => ({ message: 'assuntoInvalido' }),
    }
  ),
  mensagem: z.string().min(10, 'mensagemMuitoCurta').max(1000, 'mensagemMuitoLonga'),
  financiamento: z.boolean().default(false),
  termosPrivacidade: z.boolean().refine((val) => val === true, {
    message: 'termosPrivacidadeDevemSerAceitos',
  }),
  receberNovidades: z.boolean().default(false),
});

/**
 * @summary
 * Creates a new contact form submission
 *
 * @function postHandler
 * @module api/v1/internal/contact/controller
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Promise<void>}
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Parse and validate request body
     */
    const params = createParamsSchema.parse(req.body);

    /**
     * @validation Auto-mark financiamento if assunto is Financiamento
     */
    if (params.assunto === 'Financiamento') {
      params.financiamento = true;
    }

    /**
     * @rule {fn-contact-creation} Execute contact creation with email notifications
     */
    const result = await contactCreate({
      ...params,
      ipUsuario: req.ip || req.socket.remoteAddress || 'unknown',
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('invalidParameters', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'veiculoNaoEncontrado') {
      res.status(404).json(errorResponse('veiculoNaoEncontrado', 'NOT_FOUND'));
    } else if (error.message === 'rateLimitExceeded') {
      res.status(429).json(errorResponse('multiplasTentativasDeEnvio', 'RATE_LIMIT_EXCEEDED'));
    } else {
      next(error);
    }
  }
}
