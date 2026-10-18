import { GoogleGenAI } from '@google/genai';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrlvData, normalizeCrlv, RawCrlv } from './crlv.normalizer';
import { CRLV_PROMPT, CRLV_RESPONSE_SCHEMA } from './crlv.prompt';

/** Token de injeção do client do Gemini (permite trocar por um mock nos testes). */
export const GEMINI_CLIENT = Symbol('GEMINI_CLIENT');

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export interface UploadedCrlv {
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class CrlvService {
  private readonly logger = new Logger(CrlvService.name);

  constructor(
    @Inject(GEMINI_CLIENT) private readonly gemini: GoogleGenAI | null,
    private readonly config: ConfigService,
  ) {}

  async scan(file?: UploadedCrlv): Promise<CrlvData> {
    if (!file) {
      throw new BadRequestException('Envie o arquivo do CRLV');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        'Formato não suportado. Envie um PDF, JPG ou PNG',
      );
    }
    if (!this.gemini) {
      throw new ServiceUnavailableException(
        'Leitura de CRLV indisponível: GEMINI_API_KEY não configurada',
      );
    }

    const raw = await this.extract(this.gemini, file);
    if (!raw.isCrlv) {
      throw new UnprocessableEntityException(
        'O arquivo enviado não parece ser um CRLV',
      );
    }
    return normalizeCrlv(raw);
  }

  private async extract(
    gemini: GoogleGenAI,
    file: UploadedCrlv,
  ): Promise<RawCrlv> {
    try {
      const response = await gemini.models.generateContent({
        model: this.config.get('GEMINI_MODEL', 'gemini-2.5-flash'),
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: file.mimetype,
                  data: file.buffer.toString('base64'),
                },
              },
              { text: CRLV_PROMPT },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: CRLV_RESPONSE_SCHEMA,
          temperature: 0,
        },
      });

      return JSON.parse(response.text ?? '{}') as RawCrlv;
    } catch (error) {
      this.logger.error('Falha ao ler CRLV com o Gemini', error as Error);

      if ((error as { status?: number }).status === 429) {
        throw new ServiceUnavailableException(
          'Limite da API gratuita do Gemini atingido. Tente em instantes',
        );
      }
      throw new BadGatewayException(
        'Não foi possível ler o CRLV agora. Tente novamente ou preencha manualmente',
      );
    }
  }
}