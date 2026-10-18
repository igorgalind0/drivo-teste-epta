import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;
const PASSWORD_MESSAGE = 'Use ao menos 8 caracteres, com letras e números';

const email = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail')
  .email('Digite um e-mail válido.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Informe seu nome completo')
      .max(120, 'Nome muito longo'),
    email,
    password: z.string().regex(PASSWORD_REGEX, PASSWORD_MESSAGE),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Informe seu nome').max(60),
  lastName: z.string().trim().max(60),
  email,
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z.string().regex(PASSWORD_REGEX, PASSWORD_MESSAGE),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

const currentYear = new Date().getFullYear();
const year = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^\d{4}$/, `${label} inválido`)
    .refine(
      (value) => Number(value) >= 1900 && Number(value) <= currentYear + 2,
      `${label} inválido`,
    );

/** Os campos ficam como texto no formulário e viram número no envio. */
export const vehicleSchema = z
  .object({
    plate: z
      .string()
      .transform((value) => value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
      .pipe(
        z
          .string()
          .regex(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/, 'Placa inválida (ex.: ABC1D23)'),
      ),
    renavam: z
      .string()
      .transform((value) => value.replace(/\D/g, ''))
      .pipe(z.string().regex(/^\d{9,11}$/, 'Renavam deve ter 9 a 11 dígitos')),
    chassis: z
      .string()
      .transform((value) => value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
      .pipe(
        z
          .string()
          .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Chassi deve ter 17 caracteres'),
      ),
    brand: z.string().trim().min(1, 'Informe a marca').max(40),
    model: z.string().trim().min(1, 'Informe o modelo').max(80),
    manufactureYear: year('Ano de fabricação'),
    modelYear: year('Ano do modelo'),
    color: z.string().trim().min(1, 'Informe a cor').max(30),
    fuel: z.string().min(1, 'Selecione o combustível'),
    type: z.string().min(1, 'Selecione o tipo'),
    nickname: z.string().trim().max(40, 'Máximo de 40 caracteres'),
  })
  .refine(
    ({ manufactureYear, modelYear }) => {
      const diff = Number(modelYear) - Number(manufactureYear);
      return Number.isNaN(diff) || diff === 0 || diff === 1;
    },
    {
      message: 'Deve ser igual ao de fabricação ou o ano seguinte',
      path: ['modelYear'],
    },
  );

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;
export type VehicleFormInput = z.input<typeof vehicleSchema>;
export type VehicleFormOutput = z.output<typeof vehicleSchema>;