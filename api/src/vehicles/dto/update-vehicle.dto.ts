import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';

/** Mesmos campos do cadastro, todos opcionais (PATCH parcial). */
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}