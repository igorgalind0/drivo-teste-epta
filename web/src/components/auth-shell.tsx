import Image from 'next/image';
import { LogoMark } from './logo';

interface AuthShellProps {
  image: string;
  headline: React.ReactNode;
  description: string;
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function AuthShell({
  image,
  headline,
  description,
  title,
  subtitle,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-dvh gap-4 bg-bg p-4">
      <aside className="relative hidden flex-1 overflow-hidden rounded-3xl bg-surface lg:block">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        {/* Escurece a base da foto para o texto ficar legível */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-12 bottom-12 max-w-md">
          <h2 className="text-large-title leading-[1.1]">{headline}</h2>
          <p className="mt-4 text-body text-text-secondary">{description}</p>
        </div>
      </aside>

      <main className="flex flex-1 flex-col items-center px-4">
        <div className="flex w-full max-w-[360px] flex-1 flex-col justify-center py-12">
          <div className="mb-8 flex flex-col items-center text-center">
            <LogoMark className="mb-6 h-[18px]" />
            <h1 className="text-title-2">{title}</h1>
            <p className="mt-2 max-w-[280px] text-callout text-text-secondary">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
        <p className="pb-6 text-footnote text-text-secondary">{footer}</p>
      </main>
    </div>
  );
}