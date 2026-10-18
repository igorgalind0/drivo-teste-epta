/** Placa antiga (ABC1234) ou Mercosul (ABC1D23), já sem hífen e em maiúsculas. */
export const PLATE_REGEX = /^[A-Z]{3}\d[A-Z0-9]\d{2}$/;

/** Renavam: 11 dígitos (os antigos tinham 9). */
export const RENAVAM_REGEX = /^\d{9,11}$/;

/** Chassi (VIN): 17 caracteres, sem as letras I, O e Q. */
export const CHASSIS_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

export const normalizePlate = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '');

export const normalizeDigits = (value: string) => value.replace(/\D/g, '');

export const normalizeChassis = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '');