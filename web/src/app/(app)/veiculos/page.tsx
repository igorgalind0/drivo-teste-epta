'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ErrorState } from '@/components/states';
import { ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import {
  AddVehicleCard,
  VehicleCard,
  VehicleCardSkeleton,
} from '@/components/vehicle-card';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useVehicles } from '@/hooks/use-vehicles';
import { pluralize } from '@/lib/format';

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const {
    data: vehicles,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useVehicles(debouncedSearch);

  const isSearching = debouncedSearch.length > 0;

  // Garagem vazia de verdade (e não uma busca sem resultado)
  if (vehicles?.length === 0 && !isSearching && !search && !isPlaceholderData) {
    return <EmptyGarage />;
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pt-8 pb-16 sm:px-10 sm:pt-10">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-title-1 sm:text-large-title">Meus veículos</h1>
            <Link
              href="/veiculos/novo"
              aria-label="Adicionar veículo"
              className="flex size-7 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-hover"
            >
              <Icon name="add" size={20} />
            </Link>
          </div>
          <p className="mt-1 text-footnote text-text-secondary">
            {vehicles
              ? isSearching
                ? pluralize(vehicles.length, 'resultado', 'resultados')
                : pluralize(vehicles.length, 'veículo cadastrado', 'veículos cadastrados')
              : ' '}
          </p>
        </div>

        <label className="relative w-full sm:w-80">
          <span className="sr-only">Buscar veículo</span>
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por placa ou modelo"
            className="h-9 w-full rounded-lg bg-surface pr-9 pl-9 text-callout outline-none placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/70"
          />
          {isFetching && !isPending && (
            <Spinner className="absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-text-tertiary" />
          )}
        </label>
      </div>

      {isPending ? (
        <Grid>
          {Array.from({ length: 3 }, (_, index) => (
            <VehicleCardSkeleton key={index} />
          ))}
        </Grid>
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => refetch()} />
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface px-6 py-16 text-center">
          <Icon name="search_off" size={28} className="text-text-tertiary" />
          <p className="text-headline">Nenhum veículo encontrado</p>
          <p className="text-callout text-text-secondary">
            Nada corresponde a &ldquo;{debouncedSearch}&rdquo;. Tente outra placa ou modelo.
          </p>
        </div>
      ) : (
        <Grid>
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
          {!isSearching && <AddVehicleCard />}
        </Grid>
      )}
    </main>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {children}
    </div>
  );
}

function EmptyGarage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-surface text-text-secondary">
        <Icon name="garage" size={28} />
      </span>
      <h1 className="text-title-2">Sua garagem está vazia</h1>
      <p className="mt-2 max-w-[340px] text-callout text-text-secondary">
        Adicione seu primeiro veículo. Com o CRLV em mãos, o resto vem com os
        dados preenchidos automaticamente.
      </p>
      <ButtonLink href="/veiculos/novo" className="mt-6">
        Importar CRLV
      </ButtonLink>
    </main>
  );
}