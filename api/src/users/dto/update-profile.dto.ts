import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateProfileDto {
  @IsOptional()
  @Transform(trim)
  @MaxLength(60, { message: 'Nome deve ter até 60 caracteres' })
  @MinLength(1, { message: 'Informe seu nome' })
  @IsString({ message: 'Informe seu nome' })
  firstName?: string;

  @IsOptional()
  @Transform(trim)
  @MaxLength(60, { message: 'Sobrenome deve ter até 60 caracteres' })
  @IsString({ message: 'Sobrenome inválido' })
  lastName?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;
}