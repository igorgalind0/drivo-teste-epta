import { cn } from '@/lib/cn';
import { formatPlate } from '@/lib/format';

export function Plate({
  value,
  size = 'md',
  className,
}: {
  value: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <span
      aria-label={`Placa ${value}`}
      className={cn(
        'inline-flex shrink-0 flex-col overflow-hidden rounded-[5px] border border-black/20 bg-white text-black shadow-sm',
        size === 'md' ? 'w-[104px]' : 'w-[84px]',
        className,
      )}
    >
      <span className="flex h-2.5 items-center justify-between bg-[#0b3c9c] px-1.5">
        <span className="text-[6px] font-semibold tracking-[0.1em] text-white">
          BRASIL
        </span>
        <span className="h-1.5 w-2 rounded-[1px] bg-[#1ea64a]" />
      </span>
      <span
        className={cn(
          'text-center font-mono font-medium tracking-[0.12em]',
          size === 'md' ? 'py-1 text-[15px]' : 'py-0.5 text-[12px]',
        )}
      >
        {formatPlate(value)}
      </span>
    </span>
  );
}