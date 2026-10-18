import { Schema, Type } from '@google/genai';

export const CRLV_PROMPT = `
Você recebe a imagem ou o PDF de um documento brasileiro de veículo.
Primeiro diga se é um CRLV / CRLV-e (Certificado de Registro e Licenciamento de Veículo) no campo "isCrlv".
Se for, extraia os campos abaixo exatamente como estão no documento. Use null para o que não estiver legível.

- plate: placa do veículo.
- renavam: código RENAVAM (somente dígitos).
- chassis: número do chassi.
- brand: fabricante, extraído do campo "MARCA / MODELO / VERSÃO". Ignore prefixos como "I/" (importado).
  Escreva com a capitalização usada pelo fabricante (ex.: "Toyota", "Volkswagen", "BMW").
- model: modelo e versão, sem a marca, com a capitalização natural (ex.: "Corolla Altis Hybrid", "HR-V EXL").
- manufactureYear: ano de fabricação (número).
- modelYear: ano do modelo (número).
- color: cor predominante, com só a primeira letra maiúscula (ex.: "Prata").
- fuel: combustível como está escrito no documento (ex.: "ALCOOL/GASOLINA").
- vehicleType: espécie/tipo como está no documento (ex.: "PASSAGEIRO AUTOMOVEL", "MOTOCICLETA").

Não invente valores.
`.trim();

const nullableString = { type: Type.STRING, nullable: true };
const nullableInteger = { type: Type.INTEGER, nullable: true };

/** Força o Gemini a responder num JSON com exatamente estes campos. */
export const CRLV_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    isCrlv: { type: Type.BOOLEAN },
    plate: nullableString,
    renavam: nullableString,
    chassis: nullableString,
    brand: nullableString,
    model: nullableString,
    manufactureYear: nullableInteger,
    modelYear: nullableInteger,
    color: nullableString,
    fuel: nullableString,
    vehicleType: nullableString,
  },
  required: ['isCrlv'],
};