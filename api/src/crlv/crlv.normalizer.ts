import { FuelType, VehicleType } from '@prisma/client';
import {
  normalizeChassis,
  normalizeDigits,
  normalizePlate,
} from '../vehicles/vehicle.rules';

export interface RawCrlv {
  isCrlv?: boolean | null;
  plate?: string | null;
  renavam?: string | null;
  chassis?: string | null;
  brand?: string | null;
  model?: string | null;
  manufactureYear?: number | string | null;
  modelYear?: number | string | null;
  color?: string | null;
  fuel?: string | null;
  vehicleType?: string | null;
}

export interface CrlvData {
  plate: string | null;
  renavam: string | null;
  chassis: string | null;
  brand: string | null;
  model: string | null;
  manufactureYear: number | null;
  modelYear: number | null;
  color: string | null;
  fuel: FuelType | null;
  type: VehicleType | null;
}

const simplify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();

const cleanText = (value?: string | null) => {
  const text = value?.trim().replace(/\s+/g, ' ');
  return text ? text : null;
};

const cleanWith = (
  value: string | null | undefined,
  fn: (value: string) => string,
) => {
  const result = value ? fn(value) : '';
  return result ? result : null;
};

export function toYear(value?: number | string | null): number | null {
  const year = typeof value === 'string' ? parseInt(value, 10) : value;
  if (!year || !Number.isInteger(year) || year < 1900 || year > 2100) {
    return null;
  }
  return year;
}

export function mapFuel(value?: string | null): FuelType | null {
  if (!value) return null;
  const fuel = simplify(value);
  const hasCombustion = /GASOLINA|ALCOOL|ETANOL|FLEX|DIESEL/.test(fuel);

  if (fuel.includes('HIBRID') || (fuel.includes('ELETRIC') && hasCombustion)) {
    return FuelType.HIBRIDO;
  }
  if (fuel.includes('ELETRIC')) return FuelType.ELETRICO;
  if (
    fuel.includes('FLEX') ||
    (fuel.includes('GASOLINA') && /ALCOOL|ETANOL/.test(fuel))
  ) {
    return FuelType.FLEX;
  }
  if (fuel.includes('DIESEL')) return FuelType.DIESEL;
  if (fuel.includes('GNV') || fuel.includes('GAS NATURAL')) return FuelType.GNV;
  if (/ALCOOL|ETANOL/.test(fuel)) return FuelType.ETANOL;
  if (fuel.includes('GASOLINA')) return FuelType.GASOLINA;
  return null;
}

export function mapVehicleType(value?: string | null): VehicleType | null {
  if (!value) return null;
  const type = simplify(value);

  if (/MOTOCICLETA|MOTONETA|CICLOMOTOR|TRICICLO/.test(type)) {
    return VehicleType.MOTOCICLETA;
  }
  if (/CAMINHONETE|CAMIONETA/.test(type)) return VehicleType.CAMINHONETE;
  if (type.includes('UTILITARIO')) return VehicleType.UTILITARIO;
  if (type.includes('CAMINHAO')) return VehicleType.CAMINHAO;
  if (type.includes('AUTOMOVEL')) return VehicleType.AUTOMOVEL;
  return type ? VehicleType.OUTRO : null;
}

export function normalizeCrlv(raw: RawCrlv): CrlvData {
  return {
    plate: cleanWith(raw.plate, normalizePlate),
    renavam: cleanWith(raw.renavam, normalizeDigits),
    chassis: cleanWith(raw.chassis, normalizeChassis),
    brand: cleanText(raw.brand),
    model: cleanText(raw.model),
    manufactureYear: toYear(raw.manufactureYear),
    modelYear: toYear(raw.modelYear),
    color: cleanText(raw.color),
    fuel: mapFuel(raw.fuel),
    type: mapVehicleType(raw.vehicleType),
  };
}