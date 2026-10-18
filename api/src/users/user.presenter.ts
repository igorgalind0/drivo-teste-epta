import { User } from '@prisma/client';

export type PublicUser = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'email' | 'createdAt'
>;

/** Remove campos sensíveis (como o hash da senha) antes de devolver o usuário. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
  };
}