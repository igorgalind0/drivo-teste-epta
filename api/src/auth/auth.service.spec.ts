import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService, splitFullName } from './auth.service';

const now = new Date('2026-03-14T12:00:00Z');

function makeUser(overrides = {}) {
  return {
    id: 'user-1',
    firstName: 'Mariana',
    lastName: 'Costa',
    email: 'mariana@email.com',
    passwordHash: bcrypt.hashSync('senha1234', 4),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
  };
  const jwt = { signAsync: jest.fn().mockResolvedValue('token-fake') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  describe('splitFullName', () => {
    it('separa o primeiro nome do restante', () => {
      expect(splitFullName('  Mariana  Costa Silva ')).toEqual({
        firstName: 'Mariana',
        lastName: 'Costa Silva',
      });
    });

    it('aceita nome sem sobrenome', () => {
      expect(splitFullName('Mariana')).toEqual({
        firstName: 'Mariana',
        lastName: '',
      });
    });
  });

  describe('register', () => {
    it('cria o usuário com senha criptografada e devolve o token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation(({ data }) =>
        Promise.resolve(makeUser(data)),
      );

      const result = await service.register({
        name: 'Mariana Costa',
        email: 'mariana@email.com',
        password: 'senha1234',
      });

      const { data } = prisma.user.create.mock.calls[0][0];
      expect(data.passwordHash).not.toBe('senha1234');
      expect(await bcrypt.compare('senha1234', data.passwordHash)).toBe(true);
      expect(result.accessToken).toBe('token-fake');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(jwt.signAsync).toHaveBeenCalledWith({ sub: 'user-1' });
    });

    it('recusa e-mail já cadastrado', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());

      await expect(
        service.register({
          name: 'Outra Pessoa',
          email: 'mariana@email.com',
          password: 'senha1234',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('devolve o token quando a senha confere', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());

      const result = await service.login({
        email: 'mariana@email.com',
        password: 'senha1234',
      });

      expect(result.accessToken).toBe('token-fake');
      expect(result.user.email).toBe('mariana@email.com');
    });

    it('recusa senha incorreta', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());

      await expect(
        service.login({ email: 'mariana@email.com', password: 'errada123' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('recusa e-mail inexistente com a mesma mensagem', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'ninguem@email.com', password: 'senha1234' }),
      ).rejects.toThrow('E-mail ou senha inválidos');
    });
  });
});