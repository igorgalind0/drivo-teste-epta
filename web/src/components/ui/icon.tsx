import { cn } from '@/lib/cn';

interface IconProps {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
}

export function Icon({ name, size = 20, filled, className }: IconProps) {
  return (
    <span
      aria-hidden
      className={cn('material-symbols-rounded shrink-0', className)}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}