import Link from 'next/link';

export function PageTitle({
  children,
  backHref = '/veiculos',
}: {
  children: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pt-8 pb-6 sm:px-10 sm:pt-10">
      <Link href={backHref} className="text-footnote text-accent hover:text-accent-hover">
        Voltar
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}