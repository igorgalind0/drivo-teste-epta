import Image from 'next/image';
import Link from 'next/link';
import { maskChassis } from '@/lib/format';
import type { Vehicle } from '@/lib/types';
import {
  colorSwatch,
  FUEL_LABELS,
  TYPE_ICONS,
  vehicleCover,
} from '@/lib/vehicle-options';
import { Icon } from './ui/icon';
import { Plate } from './ui/plate';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/veiculos/${vehicle.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-surface transition hover:bg-[#232325] focus-visible:outline-2 focus-visible:outline-accent"
    >
      <VehicleCover vehicle={vehicle} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-text-tertiary uppercase">
              {vehicle.brand}
            </p>
            <h3 className="mt-1 truncate text-headline">{vehicle.model}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-footnote text-text-secondary">
              <span
                className="size-2 shrink-0 rounded-full ring-1 ring-white/15"
                style={{ backgroundColor: colorSwatch(vehicle.color) }}
              />
              {vehicle.color} · {vehicle.manufactureYear}/{vehicle.modelYear} ·{' '}
              {FUEL_LABELS[vehicle.fuel]}
            </p>
          </div>
          <Plate value={vehicle.plate} size="sm" className="mt-3" />
        </div>

        <div className="mt-5 flex items-end gap-6">
          <DocumentInfo label="Renavam" value={vehicle.renavam} />
          <DocumentInfo label="Chassi" value={maskChassis(vehicle.chassis)} />
          <span className="ml-auto flex size-7 items-center justify-center rounded-full bg-surface-2 text-text-secondary transition group-hover:bg-accent group-hover:text-white">
            <Icon name="arrow_forward" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function DocumentInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold tracking-[0.12em] text-text-tertiary uppercase">
        {label}
      </p>
      <p className="mt-1 truncate font-mono text-footnote">{value}</p>
    </div>
  );
}

function VehicleCover({ vehicle }: { vehicle: Vehicle }) {
  const cover = vehicleCover(vehicle);

  return (
    <div className="relative flex h-[200px] items-center justify-center overflow-hidden bg-gradient-to-b from-[#232326] to-[#121214]">
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <Icon
          name={TYPE_ICONS[vehicle.type]}
          size={88}
          filled
          className="text-white/12 transition-transform duration-300 group-hover:scale-105"
        />
      )}
      {vehicle.nickname && (
        <span className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-footnote text-text-primary backdrop-blur">
          {vehicle.nickname}
        </span>
      )}
    </div>
  );
}

export function AddVehicleCard() {
  return (
    <Link
      href="/veiculos/novo"
      className="flex min-h-[340px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-surface-4 p-6 text-center transition hover:border-text-tertiary hover:bg-surface/40"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-text-primary">
        <Icon name="add" size={20} />
      </span>
      <span className="text-callout font-medium">Adicionar veículo</span>
      <span className="text-footnote text-text-secondary">
        Preencha manualmente ou importe o CRLV
      </span>
    </Link>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-surface" aria-hidden>
      <div className="h-[200px] bg-surface-2/60" />
      <div className="space-y-3 p-5">
        <div className="h-2.5 w-16 rounded bg-surface-2" />
        <div className="h-4 w-40 rounded bg-surface-2" />
        <div className="h-3 w-32 rounded bg-surface-2" />
        <div className="flex gap-6 pt-3">
          <div className="h-6 w-24 rounded bg-surface-2" />
          <div className="h-6 w-24 rounded bg-surface-2" />
        </div>
      </div>
    </div>
  );
}