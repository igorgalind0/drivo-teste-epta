import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CrlvService, MAX_FILE_SIZE, UploadedCrlv } from './crlv.service';

@ApiTags('crlv')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crlv')
export class CrlvController {
  constructor(private readonly crlvService: CrlvService) {}

  @Post('scan')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  // Sem `storage`, o multer mantém o arquivo só em memória (file.buffer)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }),
  )
  scan(@UploadedFile() file?: UploadedCrlv) {
    return this.crlvService.scan(file);
  }
}