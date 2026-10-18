'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatMonthYear, initials } from '@/lib/format';
import {
  type PasswordForm,
  passwordSchema,
  type ProfileForm,
  profileSchema,
} from '@/lib/schemas';
import type { User } from '@/lib/types';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-10 pb-16 sm:px-10">
      <div className="mb-12 flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-avatar text-title-2 text-white">
          {initials(user.firstName, user.lastName)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-title-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="truncate text-footnote text-text-secondary">
            {user.email} · Membro desde {formatMonthYear(user.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <ProfileSection user={user} />
        <PasswordSection />

        <Row
          title="Conta"
          description="Encerra a sessão neste dispositivo."
        >
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface p-4">
            <div>
              <p className="text-callout font-medium">Sair da conta</p>
              <p className="text-footnote text-text-secondary">
                Encerra a sessão neste dispositivo
              </p>
            </div>
            <Button variant="link" onClick={signOut}>
              Sair
            </Button>
          </div>
        </Row>
      </div>
    </main>
  );
}

function ProfileSection({ user }: { user: User }) {
  const { setUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  const update = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (updated) => {
      setUser(updated); // atualiza nome/avatar no header na hora
      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
      });
    },
  });

  return (
    <Row
      title="Informações pessoais"
      description="Seu nome aparece no app. O e-mail é usado para entrar e receber avisos."
    >
      <Card
        onSubmit={handleSubmit((data) => update.mutate(data))}
        footer={
          update.isError ? (
            <FormError message={update.error.message} />
          ) : update.isSuccess && !isDirty ? (
            <span className="text-success">Alterações salvas</span>
          ) : (
            'Alterações salvas ficam visíveis na hora.'
          )
        }
        action={
          <Button type="submit" loading={update.isPending} disabled={!isDirty}>
            Salvar
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nome" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Sobrenome" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
          <Input label="E-mail" type="email" autoComplete="email" containerClassName="sm:col-span-2" error={errors.email?.message} {...register('email')} />
        </div>
      </Card>
    </Row>
  );
}

function PasswordSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const change = useMutation({
    mutationFn: ({ currentPassword, newPassword }: PasswordForm) =>
      api.changePassword({ currentPassword, newPassword }),
    onSuccess: () => reset({ currentPassword: '', newPassword: '', confirmPassword: '' }),
  });

  return (
    <Row
      title="Senha"
      description="Use ao menos 8 caracteres, combinando letras e números. Você continuará conectado neste dispositivo."
    >
      <Card
        onSubmit={handleSubmit((data) => change.mutate(data))}
        footer={
          change.isError ? (
            <FormError message={change.error.message} />
          ) : change.isSuccess ? (
            <span className="text-success">Senha alterada</span>
          ) : (
            'Altere sua senha com segurança.'
          )
        }
        action={
          <Button type="submit" variant="secondary" loading={change.isPending}>
            Alterar senha
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Senha atual" type="password" autoComplete="current-password" containerClassName="sm:col-span-2" error={errors.currentPassword?.message} {...register('currentPassword')} />
          <Input label="Nova senha" type="password" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" error={errors.newPassword?.message} {...register('newPassword')} />
          <Input label="Confirmar nova senha" type="password" autoComplete="new-password" placeholder="Repita a nova senha" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        </div>
      </Card>
    </Row>
  );
}

/** Seção em duas colunas: descrição à esquerda e conteúdo à direita. */
function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-[280px_minmax(0,1fr)] md:gap-6">
      <div>
        <h2 className="text-callout font-semibold">{title}</h2>
        <p className="mt-1 text-footnote text-text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Card({
  children,
  footer,
  action,
  onSubmit,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  action: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form noValidate onSubmit={onSubmit} className="overflow-hidden rounded-2xl bg-surface">
      <div className="p-4 sm:p-5">{children}</div>
      <div className="flex items-center justify-between gap-4 bg-[#18181a] px-4 py-3 text-footnote text-text-tertiary sm:px-5">
        <div className="min-w-0">{footer}</div>
        {action}
      </div>
    </form>
  );
}