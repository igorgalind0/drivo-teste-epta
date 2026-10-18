import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, AuthUser } from './jwt-auth.guard';

/** Atalho para pegar o usuário autenticado: `@CurrentUser() user: AuthUser` */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
);