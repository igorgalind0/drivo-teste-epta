import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Spinner } from './spinner';

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-hover active:bg-accent-pressed disabled:bg-accent/40 disabled:text-white/50',
  secondary:
    'bg-surface-2 text-text-primary hover:bg-surface-3 active:bg-surface-4 disabled:bg-surface-2/60 disabled:text-text-tertiary',
  destructive:
    'bg-danger text-white hover:bg-danger/80 active:bg-[#d93a31] disabled:bg-danger/30 disabled:text-white/50',
  'destructive-soft':
    'bg-danger/15 text-danger hover:bg-danger/25 active:bg-danger/30 disabled:opacity-50',
  link: 'text-accent hover:text-accent-hover px-0! h-auto!',
};

const sizes = {
  md: 'h-9 px-4 text-callout',
  lg: 'h-11 px-5 text-body',
};

type Variant = keyof typeof variants;

interface ButtonStyleProps {
  variant?: Variant;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
}

function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
}: ButtonStyleProps) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:cursor-not-allowed cursor-pointer',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
  );
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {
  loading?: boolean;
}

export function Button({
  variant,
  size,
  fullWidth,
  loading,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

interface ButtonLinkProps
  extends React.ComponentProps<typeof Link>,
    ButtonStyleProps {}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}