# AdVision - Diario di sviluppo (Parte 3)

## Obiettivo della sessione

Completare tre step della roadmap sul modulo **Campaigns**: DTO,
Swagger, Prisma + PostgreSQL.

## 1. DTO e validazione

### Cosa è stato aggiunto

-   `dto/create-campaign.dto.ts` — validazione con `class-validator`
    (`name` obbligatorio, `budget` numerico ≥ 0, `status` opzionale
    come enum, `spend`/`ctr` opzionali con default)
-   `dto/update-campaign.dto.ts` — versione parziale via `PartialType`
-   `entities/campaign.entity.ts` — classe che tipizza la forma di una
    campagna

### Modifiche a service e controller

Il `CampaignsService`, prima limitato a un array statico restituito da
`findAll()`, è stato esteso con operazioni CRUD complete: `findAll`,
`findOne`, `create`, `update`, `remove`.

Il `CampaignsController` espone di conseguenza:

    GET    /campaigns
    GET    /campaigns/:id
    POST   /campaigns
    PATCH  /campaigns/:id
    DELETE /campaigns/:id

### Validazione globale

In `main.ts` è stata attivata una `ValidationPipe` globale:

``` ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Senza questa pipe i decoratori nei DTO non avrebbero avuto alcun
effetto.

### Dipendenze aggiunte

-   `class-validator`
-   `class-transformer`

## 2. Swagger

### Cosa è stato aggiunto

-   Configurazione di `SwaggerModule` in `main.ts`, esposta su
    `/api`
-   `@ApiTags`, `@ApiOperation`, `@ApiOkResponse`,
    `@ApiCreatedResponse`, `@ApiNotFoundResponse` sul controller
-   `@ApiProperty` / `@ApiPropertyOptional` sui DTO (esempi, vincoli
    min/max, enum)
-   `@ApiProperty` sull'entity `Campaign`, usata come tipo di risposta

### Nota tecnica

`UpdateCampaignDto` è stato aggiornato per usare `PartialType` da
`@nestjs/swagger` invece che da `@nestjs/mapped-types`: fa la stessa
cosa ma propaga anche i metadati Swagger dei campi ereditati.

### Dipendenze aggiunte

-   `@nestjs/swagger`

### Come verificare

    http://localhost:3000/api

UI interattiva con schema di richieste/risposte e possibilità di
testare gli endpoint direttamente da browser ("Try it out").

## 3. Prisma + PostgreSQL

### Cosa è stato aggiunto

-   `prisma/schema.prisma` — modello `Campaign` ed enum
    `CampaignStatus` (ora unica fonte di verità: l'enum locale
    duplicato in `entities/` è stato rimosso)
-   `prisma/seed.ts` — script che ripopola il database con le tre
    campagne mock (Estate 2026, San Valentino, Black Friday)
-   `.env` / `.env.example` — variabile `DATABASE_URL`
-   `src/prisma/prisma.service.ts` — wrapper di `PrismaClient` nel
    ciclo di vita NestJS (`onModuleInit` / `onModuleDestroy`)
-   `src/prisma/prisma.module.ts` — modulo `@Global()`, così
    `PrismaService` è iniettabile ovunque senza reimportarlo

### Modifiche al service

`CampaignsService` non usa più un array in-memory: tutte le operazioni
passano da `PrismaService` (`findMany`, `findUnique`, `create`,
`update`, `delete`). Gli errori Prisma `P2025` (record non trovato)
vengono intercettati e trasformati in `NotFoundException` (404).

### Test

I test di `campaigns.service.spec.ts` e
`campaigns.controller.spec.ts` sono stati aggiornati per usare dei
**mock** di `PrismaService` / `CampaignsService`, evitando di toccare
un database reale durante gli unit test.

### Dipendenze aggiunte

-   `@prisma/client`
-   `prisma` (dev)

### Script npm aggiunti

    npm run prisma:generate   # genera il client Prisma
    npm run prisma:migrate    # crea/applica una migration
    npm run prisma:studio     # UI web per ispezionare i dati
    npm run prisma:seed       # popola il DB con i dati mock

### Setup richiesto (una tantum)

1.  Avere PostgreSQL disponibile (locale o via Docker)
2.  Configurare `DATABASE_URL` in `.env`
3.  `npm install` (lancia anche `prisma generate` via `postinstall`)
4.  `npm run prisma:migrate -- --name init`
5.  `npm run prisma:seed`
6.  `npm run start:dev`

## Stato del progetto aggiornato

Completato: - Backend NestJS - Endpoint `/health` - Modulo Campaigns
con CRUD completo - DTO con validazione (`class-validator`) -
Documentazione Swagger su `/api` - Persistenza reale con Prisma +
PostgreSQL - Seed dei dati mock - Test unitari aggiornati con mock

Prossimi passi: 1. Meta Marketing API (dati reali al posto dei mock)
2. Frontend React
