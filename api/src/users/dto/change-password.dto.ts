import { IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_RULE_MESSAGE } from '../../auth/password.rules';

export class ChangePasswordDto {
  @MinLength(1, { message: 'Informe a senha atual' })
  @IsString({ message: 'Informe a senha atual' })
  currentPassword: string;

  @Matches(PASSWORD_REGEX, { message: PASSWORD_RULE_MESSAGE })
  @IsString({ message: PASSWORD_RULE_MESSAGE })
  newPassword: string;
}