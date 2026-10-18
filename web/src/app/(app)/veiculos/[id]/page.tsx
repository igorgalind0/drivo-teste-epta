'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CrlvUpdateButton } from '@/components/crlv-import';
import { PageTitle } from '@/components/page-title';
import { ErrorState } from '@/components/states';
import { Button, ButtonLink } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Plate } from '@/components/ui/plate';
import { Spinner } from '@/components/ui/spinner';
import { VehicleForm } from '@/components/vehicle-form';
import {
  useDeleteVehicle,
  useUpdateVehicle,
  useVehicle,
} from '@/hooks/use-vehicles';
import { ApiError } from '@/lib/api';
import { formatRelativeDate, formatShortDate } from '@/lib/format';
import type { Vehicle } from '@/lib/types';

export default function EditVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const { data: vehicle, isPending, isError, error, refetch } = useVehicle(id);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center text-text-secondary">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    const notFound =
      error instanceof ApiError && [400, 404].includes(error.status);
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-16">
        {notFound ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-title-2">Veículo não encontrado</h1>
            <p className="text-callout text-text-secondary">
              Ele pode ter sido excluído ou não pertence à sua conta.
            </p>
            <ButtonLink href="/veiculos" variant="secondary" className="mt-3">
              Voltar para a garagem
            </ButtonLink>
          </div>
        ) : (
          <ErrorState message={error.message} onRetry={() => refetch()} />
        )}
      </main>
    );
  }

  return <EditVehicle key={vehicle.id} vehicle={vehicle} />;
}

function EditVehicle({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const updateVehicle = useUpdateVehicle(vehicle.id);
  const deleteVehicle = useDeleteVehicle();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <PageTitle>
        <h1 className="text-title-1 sm:text-large-title">{vehicle.model}</h1>
        <Plate value={vehicle.plate} />
      </PageTitle>

      <VehicleForm
        vehicle={vehicle}
        footerLabel="Editando"
        submitting={updateVehicle.isPending}
        submitError={updateVehicle.error?.message}
        onSubmit={(data) =>
          updateVehicle.mutate(data, {
            onSuccess: () => router.push('/veiculos'),
          })
        }
        aside={(applyCrlv) => (
          <>
            <dl className="divide-y divide-separator rounded-2xl bg-surface px-4 text-footnote">
              <div className="flex justify-between py-3">
                <dt className="text-text-secondary">Cadastrado em</dt>
                <dd>{formatShortDate(vehicle.createdAt)}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-text-secondary">Última alteração</dt>
                <dd>{formatRelativeDate(vehicle.updatedAt)}</dd>
              </div>
            </dl>

            <CrlvUpdateButton onScanned={applyCrlv} />

            <section className="rounded-2xl bg-surface p-4">
              <h2 className="text-callout font-semibold">Excluir veículo</h2>
              <p className="mt-1 text-footnote text-text-secondary">
                Remove o veículo e todos os seus dados da sua garagem. Não é
                possível desfazer.
              </p>
              <Button
                variant="destructive-soft"
                fullWidth
                className="mt-4"
                onClick={() => setConfirmOpen(true)}
              >
                Excluir veículo
              </Button>
            </section>
          </>
        )}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={`Excluir ${vehicle.model}?`}
        description={
          <>
            O veículo de placa{' '}
            <span className="font-mono text-text-primary">{vehicle.plate}</span>{' '}
            e todos os seus dados serão removidos permanentemente.
          </>
        }
        confirmLabel="Excluir"
        loading={deleteVehicle.isPending}
        error={deleteVehicle.error?.message}
        onCancel={() => {
          deleteVehicle.reset();
          setConfirmOpen(false);
        }}
        onConfirm={() =>
          deleteVehicle.mutate(vehicle.id, {
            onSuccess: () => router.replace('/veiculos'),
          })
        }
      />
    </>
  );
}