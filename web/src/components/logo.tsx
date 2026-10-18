import Image from 'next/image';
import { cn } from '@/lib/cn';

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt=""
      width={88}
      height={28}
      priority
      className={cn('h-[18px] w-auto', className)}
    />
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-text-primary">
      <LogoMark className="h-3.5" />
      <span className="hidden text-callout font-semibold sm:inline">Drivo</span>
    </span>
  );
}