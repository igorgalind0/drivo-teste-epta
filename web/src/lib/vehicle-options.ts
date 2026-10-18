import type { FuelType, Vehicle, VehicleType } from './types';

export const FUEL_LABELS: Record<FuelType, string> = {
  FLEX: 'Flex',
  GASOLINA: 'Gasolina',
  ETANOL: 'Etanol',
  DIESEL: 'Diesel',
  HIBRIDO: 'Híbrido',
  ELETRICO: 'Elétrico',
  GNV: 'GNV',
};

export const TYPE_LABELS: Record<VehicleType, string> = {
  AUTOMOVEL: 'Automóvel',
  MOTOCICLETA: 'Motocicleta',
  CAMINHONETE: 'Caminhonete',
  UTILITARIO: 'Utilitário',
  CAMINHAO: 'Caminhão',
  OUTRO: 'Outro',
};

const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({
    value,
    label,
  }));

export const FUEL_OPTIONS = toOptions(FUEL_LABELS);
export const TYPE_OPTIONS = toOptions(TYPE_LABELS);

export const TYPE_ICONS: Record<VehicleType, string> = {
  AUTOMOVEL: 'directions_car',
  MOTOCICLETA: 'two_wheeler',
  CAMINHONETE: 'airport_shuttle',
  UTILITARIO: 'airport_shuttle',
  CAMINHAO: 'local_shipping',
  OUTRO: 'commute',
};

const COLOR_SWATCHES: Record<string, string> = {
  prata: '#c7c7cc',
  preto: '#1c1c1e',
  preta: '#1c1c1e',
  branco: '#ffffff',
  branca: '#ffffff',
  cinza: '#8e8e93',
  azul: '#0a84ff',
  vermelho: '#ff453a',
  vermelha: '#ff453a',
  verde: '#30d158',
  amarelo: '#ffd60a',
  amarela: '#ffd60a',
  laranja: '#ff9f0a',
  marrom: '#8b5a2b',
  bege: '#d8c3a5',
  dourado: '#d4af37',
  dourada: '#d4af37',
  vinho: '#7b1e3a',
  rosa: '#ff6b9a',
  roxo: '#bf5af2',
  roxa: '#bf5af2',
};

export function colorSwatch(color: string) {
  const key = color
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/\s+/)[0];
  return COLOR_SWATCHES[key] ?? '#8e8e93';
}

const CAR_COVERS = [
  '/images/vehicles/car-1.jpg',
  '/images/vehicles/car-2.jpg',
  '/images/vehicles/car-3.jpg',
];

function hashString(text: string) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

export function vehicleCover(vehicle: Pick<Vehicle, 'id' | 'type'>) {
  switch (vehicle.type) {
    case 'AUTOMOVEL':
      return CAR_COVERS[hashString(vehicle.id) % CAR_COVERS.length];
    case 'CAMINHONETE':
    case 'UTILITARIO':
      return '/images/vehicles/pickup.jpg';
    case 'MOTOCICLETA':
      return '/images/vehicles/motorcycle.jpg';
    default:
      return null;
  }
}