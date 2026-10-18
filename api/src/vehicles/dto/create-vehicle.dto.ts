import { FuelType, VehicleType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  CHASSIS_REGEX,
  normalizeChassis,
  normalizeDigits,
  normalizePlate,
  PLATE_REGEX,
  RENAVAM_REGEX,
} from '../vehicle.rules';

const MAX_YEAR = new Date().getFullYear() + 1;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const using =
  (fn: (value: string) => string) =>
  ({ value }: { value: unknown }) =>
    typeof value === 'string' ? fn(value) : value;

export class CreateVehicleDto {
  /** Placa no formato antigo (ABC1234) ou Mercosul (ABC1D23). Hífen é aceito. */
  @Transform(using(normalizePlate))
  @Matches(PLATE_REGEX, { message: 'Placa inválida' })
  plate: string;

  /** Renavam com 9 a 11 dígitos. */
  @Transform(using(normalizeDigits))
  @Matches(RENAVAM_REGEX, { message: 'Renavam inválido' })
  renavam: string;

  /** Chassi (VIN) com 17 caracteres. */
  @Transform(using(normalizeChassis))
  @Matches(CHASSIS_REGEX, { message: 'Chassi inválido' })
  chassis: string;

  @Transform(trim)
  @MaxLength(40, { message: 'Marca deve ter até 40 caracteres' })
  @MinLength(1, { message: 'Informe a marca' })
  @IsString({ message: 'Informe a marca' })
  brand: string;

  @Transform(trim)
  @MaxLength(80, { message: 'Modelo deve ter até 80 caracteres' })
  @MinLength(1, { message: 'Informe o modelo' })
  @IsString({ message: 'Informe o modelo' })
  model: string;

  @Max(MAX_YEAR, { message: 'Ano de fabricação inválido' })
  @Min(1900, { message: 'Ano de fabricação inválido' })
  @IsInt({ message: 'Ano de fabricação inválido' })
  manufactureYear: number;

  @Max(MAX_YEAR + 1, { message: 'Ano do modelo inválido' })
  @Min(1900, { message: 'Ano do modelo inválido' })
  @IsInt({ message: 'Ano do modelo inválido' })
  modelYear: number;

  @Transform(trim)
  @MaxLength(30, { message: 'Cor deve ter até 30 caracteres' })
  @MinLength(1, { message: 'Informe a cor' })
  @IsString({ message: 'Informe a cor' })
  color: string;

  @IsEnum(FuelType, { message: 'Combustível inválido' })
  fuel: FuelType;

  @IsEnum(VehicleType, { message: 'Tipo de veículo inválido' })
  type: VehicleType;

  /** Apelido opcional, ex.: "Carro da família". */
  @IsOptional()
  @Transform(trim)
  @MaxLength(40, { message: 'Apelido deve ter até 40 caracteres' })
  @IsString({ message: 'Apelido inválido' })
  nickname?: string;
}