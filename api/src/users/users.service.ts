import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { BCRYPT_ROUNDS } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PublicUser, toPublicUser } from './user.presenter';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<PublicUser> {
    return toPublicUser(await this.findOrFail(userId));
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<PublicUser> {
    if (dto.email) {
      const owner = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (owner && owner.id !== userId) {
        throw new ConflictException('Este e-mail já está em uso');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    return toPublicUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.findOrFail(userId);

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS) },
    });
  }

  private async findOrFail(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}