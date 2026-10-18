import { GoogleGenAI } from '@google/genai';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrlvController } from './crlv.controller';
import { CrlvService, GEMINI_CLIENT } from './crlv.service';

@Module({
  controllers: [CrlvController],
  providers: [
    CrlvService,
    {
      // Sem chave configurada a API sobe normalmente; só a leitura de CRLV
      // responde 503 (o resto do sistema continua funcionando).
      provide: GEMINI_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const apiKey = config.get<string>('GEMINI_API_KEY');
        return apiKey ? new GoogleGenAI({ apiKey }) : null;
      },
    },
  ],
})
export class CrlvModule {}