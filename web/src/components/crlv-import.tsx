'use client';

import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatFileSize } from '@/lib/format';
import type { CrlvData } from '@/lib/types';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { Spinner } from './ui/spinner';

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp';

/** Escolha do arquivo, validação local e chamada ao /crlv/scan. */
function useCrlvScan(onScanned: (data: CrlvData) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const scan = useMutation({ mutationFn: api.scanCrlv, onSuccess: onScanned });

  function handleFile(selected?: File | null) {
    if (!selected) return;
    setFile(selected);
    scan.reset();

    if (!ACCEPT.split(',').includes(selected.type)) {
      setLocalError('Formato não suportado. Envie um PDF, JPG ou PNG');
      return;
    }
    if (selected.size > MAX_SIZE) {
      setLocalError('Arquivo maior que 10 MB');
      return;
    }
    setLocalError(null);
    scan.mutate(selected);
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      className="hidden"
      onChange={(event) => {
        handleFile(event.target.files?.[0]);
        event.target.value = ''; // permite escolher o mesmo arquivo de novo
      }}
    />
  );

  return {
    file,
    input,
    handleFile,
    open: () => inputRef.current?.click(),
    isLoading: scan.isPending,
    isSuccess: scan.isSuccess,
    error: localError ?? scan.error?.message ?? null,
  };
}

interface CrlvImportProps {
  onScanned: (data: CrlvData) => void;
}

/** Painel lateral do cadastro */
export function CrlvImportPanel({ onScanned }: CrlvImportProps) {
  const crlv = useCrlvScan(onScanned);
  const [dragging, setDragging] = useState(false);

  return (
    <section
      aria-label="Importar CRLV"
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        crlv.handleFile(event.dataTransfer.files[0]);
      }}
      className={cn(
        'rounded-2xl bg-surface p-4 transition',
        dragging && 'ring-2 ring-accent',
      )}
    >
      {crlv.input}
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Icon name="document_scanner" size={20} />
        </span>
        <div>
          <h2 className="text-callout font-semibold">Importar CRLV</h2>
          <p className="text-footnote text-text-secondary">
            Preenchemos o formulário para você
          </p>
        </div>
      </div>

      <FileStatus crlv={crlv} />

      <Button
        variant="secondary"
        fullWidth
        className="mt-3"
        onClick={crlv.open}
        disabled={crlv.isLoading}
      >
        {crlv.file ? 'Importar outro CRLV' : 'Escolher arquivo'}
      </Button>
    </section>
  );
}

function FileStatus({ crlv }: { crlv: ReturnType<typeof useCrlvScan> }) {
  const { file, isLoading, isSuccess, error } = crlv;

  let icon = <Icon name="description" size={20} className="text-text-tertiary" />;
  let title = 'Nenhum arquivo selecionado';
  let detail = 'PDF, JPG ou PNG · até 10 MB';
  let trailing: React.ReactNode = null;

  if (file) {
    icon = (
      <Icon
        name={file.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
        size={20}
        className="text-danger"
      />
    );
    title = file.name;
    detail = formatFileSize(file.size);
  }
  if (isLoading) {
    detail = 'Lendo o documento com IA…';
    trailing = <Spinner className="text-accent" />;
  } else if (isSuccess) {
    detail = `${formatFileSize(file!.size)} · lido agora`;
    trailing = <Icon name="check_circle" size={18} className="text-success" />;
  } else if (error) {
    trailing = <Icon name="error" size={18} className="text-danger" />;
  }

  return (
    <>
      <div
        aria-live="polite"
        className="mt-4 flex items-center gap-3 rounded-[10px] bg-surface-2 px-3 py-2.5"
      >
        {icon}
        <div className="min-w-0 flex-1">
          <p className="truncate text-footnote font-medium">{title}</p>
          <p className="text-[11px] text-text-tertiary">{detail}</p>
        </div>
        {trailing}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-footnote text-danger">
          {error}
        </p>
      )}
    </>
  );
}

export function CrlvUpdateButton({ onScanned }: CrlvImportProps) {
  const crlv = useCrlvScan(onScanned);

  return (
    <div>
      {crlv.input}
      <Button
        variant="secondary"
        fullWidth
        onClick={crlv.open}
        loading={crlv.isLoading}
      >
        {crlv.isLoading ? 'Lendo CRLV…' : 'Atualizar com novo CRLV'}
      </Button>
      {crlv.error && (
        <p role="alert" className="mt-2 text-footnote text-danger">
          {crlv.error}
        </p>
      )}
      {crlv.isSuccess && (
        <p className="mt-2 text-footnote text-text-secondary">
          Campos atualizados a partir do CRLV. Revise e salve.
        </p>
      )}
    </div>
  );
}