import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Vehicle } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { normalizePlate } from './vehicle.rules';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, search?: string): Promise<Vehicle[]> {
    const term = search?.trim();
    const where: Prisma.VehicleWhereInput = { userId };

    if (term) {
      const contains = (value: string) => ({
        contains: value,
        mode: Prisma.QueryMode.insensitive,
      });
      where.OR = [
        // "rtx-4b21" também encontra a placa salva como "RTX4B21"
        { plate: contains(normalizePlate(term) || term) },
        { brand: contains(term) },
        { model: contains(term) },
        { nickname: contains(term) },
      ];
    }

    return this.prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, userId },
    });
    // 404 (e não 403) para não revelar que o veículo existe em outra conta
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');
    return vehicle;
  }

  async create(userId: string, dto: CreateVehicleDto): Promise<Vehicle> {
    assertValidYears(dto.manufactureYear, dto.modelYear);

    return this.handleDuplicatePlate(() =>
      this.prisma.vehicle.create({ data: { ...dto, userId } }),
    );
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const current = await this.findOne(userId, id);
    assertValidYears(
      dto.manufactureYear ?? current.manufactureYear,
      dto.modelYear ?? current.modelYear,
    );

    return this.handleDuplicatePlate(() =>
      this.prisma.vehicle.update({ where: { id }, data: dto }),
    );
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);
    await this.prisma.vehicle.delete({ where: { id } });
  }

  /** Converte o erro de unique constraint do Prisma (P2002) num 409 legível. */
  private async handleDuplicatePlate<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Esta placa já está na sua garagem');
      }
      throw error;
    }
  }
}

/** O ano do modelo pode ser igual ao de fabricação ou no máximo 1 ano depois. */
export function assertValidYears(manufactureYear: number, modelYear: number) {
  if (modelYear < manufactureYear || modelYear > manufactureYear + 1) {
    throw new BadRequestException(
      'O ano do modelo deve ser igual ao de fabricação ou o ano seguinte',
    );
  }
}