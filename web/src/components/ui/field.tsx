'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-footnote text-text-secondary">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-footnote text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-footnote text-text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}

const controlClasses = (hasError: boolean, hasTrailing: boolean) =>
  cn(
    'h-10 w-full rounded-lg bg-surface-2 px-3 text-callout text-text-primary outline-none transition',
    'placeholder:text-text-tertiary',
    'focus:ring-2 focus:ring-accent/70',
    'disabled:cursor-not-allowed disabled:bg-surface-2/50 disabled:text-text-tertiary',
    hasError && 'ring-2 ring-danger/80 focus:ring-danger',
    hasTrailing && 'pr-10',
  );

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Destaca que o valor veio da leitura do CRLV. */
  autoFilled?: boolean;
  mono?: boolean;
  containerClassName?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  label,
  error,
  hint,
  autoFilled,
  mono,
  type = 'text',
  className,
  containerClassName,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <FieldShell
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            controlClasses(!!error, isPassword || !!autoFilled),
            mono && 'font-mono tracking-wide',
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-text-tertiary hover:text-text-secondary"
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
          </button>
        ) : autoFilled ? (
          <span
            title="Preenchido pelo CRLV"
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-accent"
          >
            <Icon name="document_scanner" size={18} />
          </span>
        ) : null}
      </div>
    </FieldShell>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
  autoFilled?: boolean;
  containerClassName?: string;
  ref?: React.Ref<HTMLSelectElement>;
}

export function Select({
  label,
  error,
  options,
  placeholder = 'Selecione',
  autoFilled,
  className,
  containerClassName,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <FieldShell
      id={selectId}
      label={label}
      error={error}
      className={containerClassName}
    >
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            controlClasses(!!error, true),
            'cursor-pointer appearance-none',
            // "Selecione" com cor de placeholder enquanto nada foi escolhido
            "has-[option[value='']:checked]:text-text-tertiary",
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center',
            autoFilled ? 'text-accent' : 'text-text-tertiary',
          )}
        >
          <Icon name={autoFilled ? 'document_scanner' : 'expand_more'} size={18} />
        </span>
      </div>
    </FieldShell>
  );
}