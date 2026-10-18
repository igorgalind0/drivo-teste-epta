import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, toPublicUser } from '../users/user.presenter';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export const BCRYPT_ROUNDS = 10;

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}

/** "Mariana Costa Silva" -> { firstName: "Mariana", lastName: "Costa Silva" } */
export function splitFullName(fullName: string) {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Já existe uma conta com este e-mail');
    }

    const user = await this.prisma.user.create({
      data: {
        ...splitFullName(dto.name),
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
      },
    });

    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Mesma mensagem para e-mail inexistente e senha errada, para não revelar
    // quais e-mails estão cadastrados.
    const valid =
      user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !valid) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return this.buildResponse(user);
  }

  private async buildResponse(user: User): Promise<AuthResponse> {
    const accessToken = await this.jwt.signAsync({ sub: user.id });
    return { accessToken, user: toPublicUser(user) };
  }
}