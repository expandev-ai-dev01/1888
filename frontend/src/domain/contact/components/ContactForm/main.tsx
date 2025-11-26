import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import { Checkbox } from '@/core/components/checkbox';
import { Label } from '@/core/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/core/components/card';
import { Alert, AlertDescription } from '@/core/components/alert';
import { Separator } from '@/core/components/separator';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { CheckCircle2Icon, InfoIcon, SendIcon, XIcon } from 'lucide-react';
import { useContactSubmit } from '../../hooks/useContactSubmit';
import { contactSchema } from '../../validations/contact';
import type { ContactFormInput, ContactFormOutput } from '../../types/contact';
import type { ContactFormProps } from './types';

function ContactForm({ vehicleId, vehicleModel, onSuccess, onCancel }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormInput, unknown, ContactFormOutput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      preferenciaContato: 'E-mail',
      melhorHorario: 'Qualquer horário',
      idVeiculo: vehicleId,
      modeloVeiculo: vehicleModel,
      assunto: 'Informações gerais',
      mensagem: '',
      financiamento: false,
      termosPrivacidade: false,
      receberNovidades: false,
    },
  });

  const {
    submit,
    isSubmitting,
    isSuccess,
    isError,
    error,
    data,
    reset: resetMutation,
  } = useContactSubmit({
    onSuccess: (protocol) => {
      toast.success('Mensagem enviada com sucesso!', {
        description: `Protocolo: ${protocol}. Entraremos em contato em até 24h úteis.`,
      });
      if (onSuccess) {
        onSuccess(protocol);
      }
    },
    onError: (err) => {
      toast.error('Erro ao enviar mensagem', {
        description: err.message || 'Por favor, tente novamente.',
      });
    },
  });

  const assunto = watch('assunto');
  const mensagemLength = watch('mensagem')?.length ?? 0;
  const termosPrivacidade = watch('termosPrivacidade');

  useEffect(() => {
    if (assunto === 'Financiamento') {
      setValue('financiamento', true);
    }
  }, [assunto, setValue]);

  const onSubmit = (formData: ContactFormOutput) => {
    const sanitizedData = {
      ...formData,
      mensagem: DOMPurify.sanitize(formData.mensagem),
    };

    submit(sanitizedData);
  };

  const handleReset = () => {
    reset();
    resetMutation();
  };

  if (isSuccess && data) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="size-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2Icon className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Mensagem Enviada com Sucesso!</CardTitle>
          <CardDescription className="text-base">
            Recebemos sua mensagem e entraremos em contato em breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="size-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Número de Protocolo: {data.protocol}</p>
                <p className="text-sm">
                  Prazo estimado de resposta: <strong>24 horas úteis</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Um e-mail de confirmação foi enviado para o endereço informado.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Resumo da Mensagem</h3>
            <dl className="text-muted-foreground space-y-1 text-sm">
              <div className="flex justify-between">
                <dt>Veículo:</dt>
                <dd className="text-foreground font-medium">{vehicleModel}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Assunto:</dt>
                <dd className="text-foreground font-medium">{assunto}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
            Enviar Nova Mensagem
          </Button>
          {onCancel && (
            <Button onClick={onCancel} className="w-full sm:w-auto">
              Voltar aos Detalhes
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Entre em Contato</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para manifestar seu interesse no veículo:{' '}
          <strong>{vehicleModel}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Dados Pessoais</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nomeCompleto"
                  placeholder="João Silva"
                  {...register('nomeCompleto')}
                  aria-invalid={!!errors.nomeCompleto}
                />
                {errors.nomeCompleto && (
                  <p className="text-destructive text-sm">{errors.nomeCompleto.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    E-mail <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@exemplo.com"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">
                    Telefone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    {...register('telefone')}
                    aria-invalid={!!errors.telefone}
                  />
                  {errors.telefone && (
                    <p className="text-destructive text-sm">{errors.telefone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="preferenciaContato">
                    Preferência de Contato <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch('preferenciaContato')}
                    onValueChange={(value) =>
                      setValue(
                        'preferenciaContato',
                        value as ContactFormInput['preferenciaContato']
                      )
                    }
                  >
                    <SelectTrigger
                      id="preferenciaContato"
                      aria-invalid={!!errors.preferenciaContato}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Telefone">Telefone</SelectItem>
                      <SelectItem value="E-mail">E-mail</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferenciaContato && (
                    <p className="text-destructive text-sm">{errors.preferenciaContato.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="melhorHorario">Melhor Horário</Label>
                  <Select
                    value={watch('melhorHorario')}
                    onValueChange={(value) =>
                      setValue('melhorHorario', value as ContactFormInput['melhorHorario'])
                    }
                  >
                    <SelectTrigger id="melhorHorario">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhã">Manhã</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                      <SelectItem value="Noite">Noite</SelectItem>
                      <SelectItem value="Qualquer horário">Qualquer horário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Informações sobre o Interesse</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assunto">
                  Assunto <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch('assunto')}
                  onValueChange={(value) =>
                    setValue('assunto', value as ContactFormInput['assunto'])
                  }
                >
                  <SelectTrigger id="assunto" aria-invalid={!!errors.assunto}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informações gerais">Informações gerais</SelectItem>
                    <SelectItem value="Agendamento de test drive">
                      Agendamento de test drive
                    </SelectItem>
                    <SelectItem value="Negociação de preço">Negociação de preço</SelectItem>
                    <SelectItem value="Financiamento">Financiamento</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.assunto && (
                  <p className="text-destructive text-sm">{errors.assunto.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mensagem">
                    Mensagem <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-muted-foreground text-xs">
                    {mensagemLength}/1000 caracteres
                  </span>
                </div>
                <Textarea
                  id="mensagem"
                  placeholder="Descreva seu interesse no veículo..."
                  className="min-h-32 resize-none"
                  {...register('mensagem')}
                  aria-invalid={!!errors.mensagem}
                />
                {errors.mensagem && (
                  <p className="text-destructive text-sm">{errors.mensagem.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financiamento"
                  checked={watch('financiamento')}
                  onCheckedChange={(checked) => setValue('financiamento', checked as boolean)}
                />
                <Label htmlFor="financiamento" className="cursor-pointer font-normal">
                  Tenho interesse em opções de financiamento
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termosPrivacidade"
                  checked={watch('termosPrivacidade')}
                  onCheckedChange={(checked) => setValue('termosPrivacidade', checked as boolean)}
                  aria-invalid={!!errors.termosPrivacidade}
                />
                <div className="space-y-1">
                  <Label htmlFor="termosPrivacidade" className="cursor-pointer font-normal">
                    Li e concordo com os{' '}
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 underline underline-offset-4"
                    >
                      termos de privacidade
                    </a>{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  {errors.termosPrivacidade && (
                    <p className="text-destructive text-sm">{errors.termosPrivacidade.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="receberNovidades"
                  checked={watch('receberNovidades')}
                  onCheckedChange={(checked) => setValue('receberNovidades', checked as boolean)}
                />
                <Label htmlFor="receberNovidades" className="cursor-pointer font-normal">
                  Desejo receber novidades e promoções por e-mail
                </Label>
              </div>
            </div>

            <Alert>
              <InfoIcon className="size-4" />
              <AlertDescription className="text-sm">
                Seus dados serão utilizados apenas para entrar em contato sobre este veículo e serão
                armazenados de acordo com a LGPD.
              </AlertDescription>
            </Alert>
          </div>

          {isError && error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error.message ||
                  'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <XIcon className="size-4" />
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !termosPrivacidade}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="size-4" />
                Enviando...
              </>
            ) : (
              <>
                <SendIcon className="size-4" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export { ContactForm };
