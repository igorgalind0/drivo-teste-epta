import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @MinLength(1, { message: 'Informe sua senha' })
  @IsString({ message: 'Informe sua senha' })
  password: string;
}