# Drivo

Plataforma para montar sua garagem de veículos. O usuário cria uma conta, cadastra seus veículos e pode **importar o CRLV**: o documento é lido pela API gratuita do **Gemini** e o formulário é preenchido automaticamente.

| Camada             | Tecnologias                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Front-end (`web/`) | Next.js 15 (App Router), React 19, Tailwind CSS 4, TanStack Query, react-hook-form + zod |
| Back-end (`api/`)  | NestJS 11, Prisma 6, PostgreSQL 16, JWT, Swagger (OpenAPI), Google Gen AI SDK            |
| Testes             | Jest                                                                                     |
| Infra              | Docker e docker-compose                                                                  |

## Funcionalidades

- Cadastro, login e logout com JWT
- Garagem com listagem em cards e busca por placa, marca, modelo ou apelido
- Criar, editar e excluir veículos (com confirmação)
- Importar CRLV (PDF, JPG ou PNG) com preenchimento automático via Gemini
- Alterar dados cadastrais e senha
- Estados de carregamento, erro e vazio
- Interface baseada no Figma e responsiva
- Documentação OpenAPI em `http://localhost:3333/docs`

---

## 1. Como instalar

Pré-requisito: **Docker** com Docker Compose.

```bash
git clone https://github.com/igorgalind0/drivo-teste-epta.git
cd drivo-teste-epta
cp .env.example .env
```

Edite o `.env`:

- `JWT_SECRET`: troque por uma string longa e aleatória.
- `GEMINI_API_KEY`: gere uma chave gratuita em <https://aistudio.google.com/apikey>. Sem ela o sistema funciona normalmente, só a importação do CRLV fica indisponível (a API responde 503 com uma mensagem clara).

## 2. Como executar

```bash
docker compose up --build
```

| Serviço   | URL                          |
| --------- | ---------------------------- |
| Front-end | <http://localhost:3000>      |
| API       | <http://localhost:3333>      |
| Swagger   | <http://localhost:3333/docs> |

As migrations do banco rodam automaticamente quando a API sobe.

### Sem Docker (desenvolvimento)

```bash
docker compose up -d db

cd api
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev

cd ../web
cp .env.example .env.local
npm install
npm run dev
```

## 3. Como executar os testes

```bash
cd api
npm test
```

Os testes usam o Prisma e o JWT **mockados**, então não precisam de banco.

---

## 4. Decisões técnicas

### Estrutura

Monorepo com `api/` e `web/` independentes, cada um com seu `package.json` e `Dockerfile`, para manter cada app instalável sozinho e os Dockerfiles simples.

### Back-end

- **NestJS**: a estrutura em módulos (controller → service → Prisma) deixa cada responsabilidade num lugar previsível, com validação (`class-validator`) e Swagger integrados.
- **Prisma**: schema declarativo, migrations versionadas e client tipado. A placa é única **por usuário** (`@@unique([userId, plate])`), já que duas pessoas podem cadastrar o mesmo carro.
- **Isolamento por usuário**: todo acesso a veículo filtra por `userId`. Veículo de outra conta retorna **404**, para não revelar que o id existe.
- **JWT** validado por um guard próprio (`JwtAuthGuard`). Senhas com hash `bcryptjs`.
- **Login com mensagem genérica** ("E-mail ou senha inválidos"), para não revelar quais e-mails estão cadastrados.
- **Validação global** com `ValidationPipe`: campos desconhecidos são recusados, e placa, Renavam e chassi são normalizados antes de validar.

### Integração com o Gemini (CRLV)

- O arquivo é enviado para `POST /crlv/scan` e fica **só em memória** (não é salvo).
- A chamada usa `responseSchema`, que obriga o modelo a responder num JSON com campos fixos.
- A resposta da IA passa por um **normalizador** antes de ser usada (limpa placa, Renavam e chassi, valida os anos, mapeia combustível e tipo).
- O endpoint **não cria o veículo**: o usuário revisa os campos (os lidos pela IA ficam destacados) e salva.
- Erros com status claros: 415 (formato), 413 (arquivo > 10 MB), 422 (não é CRLV), 502 (falha do Gemini), 503 (sem chave ou limite atingido).
- A chave do Gemini fica só no back-end.

### Front-end

- **App Router** com grupos de rota `(auth)` e `(app)`, cada um com um layout que redireciona conforme a sessão.
- **TanStack Query** para cache, estados de loading/erro e atualização da lista após criar, editar ou excluir.
- **react-hook-form + zod** com as mesmas regras da API, para feedback imediato.
- **Design System do Figma em tokens** no `@theme` do Tailwind 4, com componentes reutilizáveis (`Button`, `Input`, `Select`, `Plate`, `ConfirmDialog`).
- Logo e imagens exportados do Figma, servidos com `next/image`.

## 5. Limitações

- **Fotos dos veículos**: o Figma mostra fotos nos cards, mas o formulário não tem upload. Os cards usam **capas ilustrativas por tipo** de veículo (fotos do Figma); caminhão e "outro" usam um ícone.
- **Token no `localStorage`**: simples, mas exposto em caso de XSS. Não há refresh token: ao expirar (7 dias) o usuário entra de novo.
- **Proteção de rotas no cliente**: há um breve loading antes do redirecionamento.
- **Gemini gratuito**: tem limite de requisições por minuto, e a precisão depende da qualidade do arquivo.
- **Testes**: cobrem só o serviço de autenticação da API; não há testes de front-end nem e2e.
- **Sem paginação** na listagem.

## 6. O que faria com mais tempo

- Upload de foto do veículo e lembrete de vencimento do licenciamento
- Mais testes: services de veículos e CRLV, componentes do front (Vitest) e e2e (Playwright)
- Autenticação com cookie `httpOnly` + refresh token
- Rate limiting no `/auth` e no `/crlv/scan`
- Recuperação de senha e exclusão de conta
- Paginação na garagem
- CI no GitHub Actions rodando testes e build
