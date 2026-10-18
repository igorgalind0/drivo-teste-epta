import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListVehiclesQuery {
  /** Busca por placa, marca, modelo ou apelido. */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  search?: string;
}