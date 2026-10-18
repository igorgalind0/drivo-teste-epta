'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  vehicleSchema,
  type VehicleFormInput,
  type VehicleFormOutput,
} from '@/lib/schemas';
import type { CrlvData, Vehicle, VehicleInput } from '@/lib/types';
import { FUEL_OPTIONS, TYPE_OPTIONS } from '@/lib/vehicle-options';
import { FormError } from './form-error';
import { Button } from './ui/button';
import { Input, Select } from './ui/field';

type FieldName = keyof VehicleFormInput;

const EMPTY: VehicleFormInput = {
  plate: '',
  renavam: '',
  chassis: '',
  brand: '',
  model: '',
  manufactureYear: '',
  modelYear: '',
  color: '',
  fuel: '',
  type: '',
  nickname: '',
};

export function toFormValues(vehicle?: Vehicle): VehicleFormInput {
  if (!vehicle) return EMPTY;
  return {
    ...vehicle,
    manufactureYear: String(vehicle.manufactureYear),
    modelYear: String(vehicle.modelYear),
    nickname: vehicle.nickname ?? '',
  };
}

export function toPayload(values: VehicleFormOutput): VehicleInput {
  return {
    ...values,
    manufactureYear: Number(values.manufactureYear),
    modelYear: Number(values.modelYear),
    fuel: values.fuel as VehicleInput['fuel'],
    type: values.type as VehicleInput['type'],
    nickname: values.nickname || null,
  };
}

/** Campos do CRLV que vieram preenchidos (os nulos são ignorados). */
export function crlvToFormValues(data: CrlvData) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== null && value !== '')
      .map(([key, value]) => [key, String(value)]),
  ) as Partial<VehicleFormInput>;
}

interface VehicleFormProps {
  vehicle?: Vehicle;
  /** Texto à esquerda da barra inferior, ex.: "Novo veículo" ou "Editando". */
  footerLabel: string;
  submitting: boolean;
  submitError?: string | null;
  onSubmit: (data: VehicleInput) => void;
  /** Coluna lateral. Recebe a função que aplica os dados lidos do CRLV. */
  aside: (applyCrlv: (data: CrlvData) => void) => React.ReactNode;
}

export function VehicleForm({
  vehicle,
  footerLabel,
  submitting,
  submitError,
  onSubmit,
  aside,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormInput, unknown, VehicleFormOutput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: toFormValues(vehicle),
  });

  const [autoFilled, setAutoFilled] = useState<Set<FieldName>>(new Set());

  function applyCrlv(data: CrlvData) {
    const values = crlvToFormValues(data);
    for (const [name, value] of Object.entries(values)) {
      setValue(name as FieldName, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setAutoFilled(new Set(Object.keys(values) as FieldName[]));
  }

  const field = (name: FieldName) => ({
    ...register(name, {
      onChange: () =>
        setAutoFilled((current) => {
          if (!current.has(name)) return current;
          const next = new Set(current);
          next.delete(name);
          return next;
        }),
    }),
    error: errors[name]?.message,
    autoFilled: autoFilled.has(name),
  });

  const brand = watch('brand');
  const model = watch('model');
  const plate = watch('plate');
  const summary = [footerLabel, [brand, model].filter(Boolean).join(' '), vehicle && plate]
    .filter(Boolean)
    .join(' · ');

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => onSubmit(toPayload(values)))}
      className="flex flex-1 flex-col"
    >
      <div className="mx-auto grid w-full max-w-[1280px] flex-1 gap-6 px-4 pb-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <Section
            title="Identificação"
            description="Dados oficiais do veículo, conforme o documento."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Placa" mono placeholder="ABC1D23" maxLength={8} className="uppercase placeholder:normal-case" {...field('plate')} />
              <Input label="Renavam" mono inputMode="numeric" placeholder="00000000000" maxLength={11} {...field('renavam')} />
              <Input label="Chassi" mono placeholder="17 caracteres" maxLength={17} className="uppercase placeholder:normal-case" containerClassName="sm:col-span-2" {...field('chassis')} />
            </div>
          </Section>

          <Section
            title="Características"
            description="Como o veículo aparece na sua garagem."
          >
            <div className="grid gap-4 sm:grid-cols-6">
              <Input label="Marca" placeholder="Ex.: Toyota" containerClassName="sm:col-span-3" {...field('brand')} />
              <Input label="Modelo" placeholder="Ex.: Corolla Altis Hybrid" containerClassName="sm:col-span-3" {...field('model')} />
              <Input label="Ano de fabricação" inputMode="numeric" placeholder="2022" maxLength={4} containerClassName="sm:col-span-2" {...field('manufactureYear')} />
              <Input label="Ano do modelo" inputMode="numeric" placeholder="2023" maxLength={4} containerClassName="sm:col-span-2" {...field('modelYear')} />
              <Input label="Cor" placeholder="Ex.: Prata" containerClassName="sm:col-span-2" {...field('color')} />
              <Select label="Combustível" options={FUEL_OPTIONS} containerClassName="sm:col-span-2" {...field('fuel')} />
              <Select label="Tipo" options={TYPE_OPTIONS} containerClassName="sm:col-span-2" {...field('type')} />
              <Input label="Apelido (opcional)" placeholder="Ex.: Carro da família" maxLength={40} containerClassName="sm:col-span-2" {...field('nickname')} />
            </div>
          </Section>
        </div>

        <aside className="order-1 flex flex-col gap-4 lg:order-2">
          {aside(applyCrlv)}
        </aside>
      </div>

      {/* Barra de ações fixa no rodapé */}
      <div className="sticky bottom-0 z-10 border-t border-separator bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 px-4 py-3 sm:px-10">
          <p className="hidden min-w-0 flex-1 truncate text-footnote text-text-secondary sm:block">
            {summary}
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            {submitError && <FormError message={submitError} />}
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Link
                href="/veiculos"
                className="inline-flex h-9 items-center justify-center rounded-[10px] bg-surface-2 px-4 text-callout font-medium hover:bg-surface-3"
              >
                Cancelar
              </Link>
              <Button type="submit" loading={submitting}>
                Salvar veículo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-surface p-5 sm:p-6">
      <h2 className="text-callout font-semibold">{title}</h2>
      <p className="mt-0.5 mb-5 text-footnote text-text-secondary">
        {description}
      </p>
      {children}
    </section>
  );
}