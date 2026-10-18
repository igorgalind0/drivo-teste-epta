'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { AuthShell } from '@/components/auth-shell';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { type RegisterForm, registerSchema } from '@/lib/schemas';

export default function RegisterPage() {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const createAccount = useMutation({
    mutationFn: ({ name, email, password }: RegisterForm) =>
      api.register({ name, email, password }),
    onSuccess: signIn,
  });

  return (
    <AuthShell
      image="/images/register-hero.jpg"
      headline={
        <>
          Cadastre uma vez.
          <br />O CRLV faz o resto.
        </>
      }
      description="Importe o documento e os dados do veículo são preenchidos automaticamente."
      title="Criar sua conta"
      subtitle="Leva menos de um minuto. Depois é só adicionar seus veículos."
      footer={
        <>
          Já tem uma conta?{' '}
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Entrar
          </Link>
        </>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit((data) => createAccount.mutate(data))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Nome completo"
          autoComplete="name"
          placeholder="Seu nome e sobrenome"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <FormError message={createAccount.error?.message} />
        <Button
          type="submit"
          fullWidth
          loading={createAccount.isPending}
          className="mt-2"
        >
          Criar conta
        </Button>
      </form>
    </AuthShell>
  );
}