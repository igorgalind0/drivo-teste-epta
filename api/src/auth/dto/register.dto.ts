import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_RULE_MESSAGE } from '../password.rules';

export class RegisterDto {
  /** Nome completo. O primeiro termo vira o nome e o resto o sobrenome. */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(120, { message: 'Nome muito longo' })
  @MinLength(3, { message: 'Informe seu nome completo' })
  @IsString({ message: 'Informe seu nome completo' })
  name: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @Matches(PASSWORD_REGEX, { message: PASSWORD_RULE_MESSAGE })
  @IsString({ message: PASSWORD_RULE_MESSAGE })
  password: string;
}