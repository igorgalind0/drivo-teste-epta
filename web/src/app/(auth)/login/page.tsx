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
import { type LoginForm, loginSchema } from '@/lib/schemas';

export default function LoginPage() {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const login = useMutation({ mutationFn: api.login, onSuccess: signIn });

  return (
    <AuthShell
      image="/images/login-hero.jpg"
      headline={
        <>
          Sua garagem,
          <br />
          sempre à mão.
        </>
      }
      description="Placa, Renavam e licenciamento de todos os seus veículos em um só lugar."
      title="Entrar no Drivo"
      subtitle="Seus veículos, documentos e dados em um só lugar."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="text-accent hover:text-accent-hover">
            Criar conta
          </Link>
        </>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit((data) => login.mutate(data))}
        className="flex flex-col gap-4"
      >
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
          autoComplete="current-password"
          placeholder="Sua senha"
          error={errors.password?.message}
          {...register('password')}
        />
        <FormError message={login.error?.message} />
        <Button type="submit" fullWidth loading={login.isPending} className="mt-2">
          Entrar
        </Button>
      </form>
    </AuthShell>
  );
}