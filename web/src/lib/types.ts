export type FuelType =
  | 'GASOLINA'
  | 'ETANOL'
  | 'FLEX'
  | 'DIESEL'
  | 'HIBRIDO'
  | 'ELETRICO'
  | 'GNV';

export type VehicleType =
  | 'AUTOMOVEL'
  | 'MOTOCICLETA'
  | 'CAMINHONETE'
  | 'UTILITARIO'
  | 'CAMINHAO'
  | 'OUTRO';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Vehicle {
  id: string;
  plate: string;
  renavam: string;
  chassis: string;
  brand: string;
  model: string;
  manufactureYear: number;
  modelYear: number;
  color: string;
  fuel: FuelType;
  type: VehicleType;
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
}

export type VehicleInput = Omit<
  Vehicle,
  'id' | 'createdAt' | 'updatedAt' | 'nickname'
> & { nickname: string | null };

/** Resultado da leitura do CRLV: qualquer campo pode não ter sido lido. */
export type CrlvData = {
  [K in Exclude<keyof VehicleInput, 'nickname'>]: VehicleInput[K] | null;
};