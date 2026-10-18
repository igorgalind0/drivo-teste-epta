'use client';

import { useRouter } from 'next/navigation';
import { CrlvImportPanel } from '@/components/crlv-import';
import { PageTitle } from '@/components/page-title';
import { VehicleForm } from '@/components/vehicle-form';
import { useCreateVehicle } from '@/hooks/use-vehicles';

export default function NewVehiclePage() {
  const router = useRouter();
  const createVehicle = useCreateVehicle();

  return (
    <>
      <PageTitle>
        <h1 className="text-title-1 sm:text-large-title">Novo veículo</h1>
      </PageTitle>
      <VehicleForm
        footerLabel="Novo veículo"
        submitting={createVehicle.isPending}
        submitError={createVehicle.error?.message}
        onSubmit={(data) =>
          createVehicle.mutate(data, {
            onSuccess: () => router.push('/veiculos'),
          })
        }
        aside={(applyCrlv) => <CrlvImportPanel onScanned={applyCrlv} />}
      />
    </>
  );
}