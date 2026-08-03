# AdVision - Diario di sviluppo (Parte 4 - Riepilogo generale)

Questo file riassume tutto il lavoro svolto sul progetto **AdVision**
dall'inizio a oggi, unendo quanto documentato nelle Parti 1-3 con le
attività di setup ambiente completate in questa sessione.

## Obiettivo del progetto

Piattaforma SaaS per analizzare e gestire campagne Meta Ads.

### Stack

-   TypeScript
-   Node.js (20 LTS)
-   NestJS (backend)
-   React (frontend, non ancora iniziato)
-   PostgreSQL + Prisma ORM
-   Swagger (documentazione API)
-   Tailwind CSS, Chart.js (previsti per il frontend)
-   Git

## 1. Setup iniziale del repository

-   Creazione della struttura `advision/` con `apps/`, `packages/`,
    `docs/`, `README.md`
-   `.gitignore` con `node_modules`, `dist`, `.env`, `.DS_Store`,
    `coverage`
-   Primo commit Git

## 2. Backend NestJS - base

-   Progetto NestJS creato in `apps/api`
-   Endpoint `GET /health` per verificare che il backend sia attivo
-   Modulo **Campaigns** creato con comandi `nest g mo/service/controller
    campaigns`
-   Endpoint `GET /campaigns` con dati mock (Estate 2026, San
    Valentino, Black Friday)

## 3. DTO e validazione

-   `dto/create-campaign.dto.ts` — validazione con `class-validator`
    (`name` obbligatorio, `budget` numerico ≥ 0, `status` enum
    opzionale, `spend`/`ctr` opzionali con default)
-   `dto/update-campaign.dto.ts` — versione parziale via `PartialType`
-   `entities/campaign.entity.ts` — tipizzazione della forma di una
    campagna
-   `CampaignsService` esteso da semplice `findAll()` a CRUD completo:
    `findAll`, `findOne`, `create`, `update`, `remove`
-   `CampaignsController` esteso con:

    ```text
    GET    /campaigns
    GET    /campaigns/:id
    POST   /campaigns
    PATCH  /campaigns/:id
    DELETE /campaigns/:id
    ```

-   `ValidationPipe` globale attivata in `main.ts`
    (`whitelist`, `forbidNonWhitelisted`, `transform`)
-   Dipendenze aggiunte: `class-validator`, `class-transformer`

## 4. Swagger

-   `SwaggerModule` configurato in `main.ts`, esposto su `/api`
-   Decoratori `@ApiTags`, `@ApiOperation`, `@ApiOkResponse`,
    `@ApiCreatedResponse`, `@ApiNotFoundResponse` sul controller
-   `@ApiProperty` / `@ApiPropertyOptional` sui DTO e sull'entity
    `Campaign`
-   `UpdateCampaignDto` aggiornato per usare `PartialType` da
    `@nestjs/swagger` (propaga anche i metadati Swagger)
-   Dipendenza aggiunta: `@nestjs/swagger`
-   Documentazione interattiva disponibile su
    `http://localhost:3000/api`, con possibilità di testare gli
    endpoint direttamente da browser

## 5. Prisma + PostgreSQL

-   `prisma/schema.prisma` — modello `Campaign` ed enum
    `CampaignStatus` (unica fonte di verità; l'enum locale duplicato è
    stato rimosso)
-   `prisma/seed.ts` — ripopola il database con le tre campagne mock
-   `src/prisma/prisma.service.ts` — wrapper di `PrismaClient` nel
    ciclo di vita NestJS
-   `src/prisma/prisma.module.ts` — modulo `@Global()`, così
    `PrismaService` è iniettabile ovunque
-   `CampaignsService` non usa più un array in-memory: tutte le
    operazioni passano da Prisma (`findMany`, `findUnique`, `create`,
    `update`, `delete`)
-   Errori Prisma `P2025` (record non trovato) intercettati e
    trasformati in `404 NotFoundException`
-   Test di service e controller aggiornati con **mock** di
    `PrismaService`/`CampaignsService` (nessun DB reale nei test
    unitari)
-   Dipendenze aggiunte: `@prisma/client`, `prisma` (dev)
-   Script npm aggiunti: `prisma:generate`, `prisma:migrate`,
    `prisma:studio`, `prisma:seed`

## 6. Setup ambiente (sessione odierna)

Durante l'installazione delle dipendenze Prisma sono emersi due
requisiti di ambiente non ancora soddisfatti, risolti in questa
sessione:

### Aggiornamento Node.js

Il diario originale riportava **Node.js v18.13.0**, ma Prisma richiede
almeno la 18.18. Risolto installando **nvm-windows** e passando a
**Node 20.18.0 LTS**:

```bash
nvm install 20.18.0
nvm use 20.18.0
```

Dopo il cambio versione, `node_modules` e `package-lock.json` sono
stati rigenerati da zero con `npm install`.

### Installazione PostgreSQL

Non era ancora presente un'istanza di PostgreSQL raggiungibile.
Installata la versione nativa per Windows (**PostgreSQL 18**, servizio
`postgresql-x64-18`), e creato il database `advision` tramite
**pgAdmin 4**.

### Configurazione `.env`

```text
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/advision?schema=public"
```

### Prima migration ed esito

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run start:dev
```

`GET /campaigns` restituisce correttamente le 3 campagne mock, questa
volta **lette dal database PostgreSQL reale** e non più da un array in
memoria.

## Stato attuale del progetto

Completato: - Backend NestJS - Endpoint `/health` - Modulo Campaigns
con CRUD completo (`GET`, `GET /:id`, `POST`, `PATCH`, `DELETE`) - DTO
con validazione (`class-validator`) - Documentazione Swagger su `/api`
- Persistenza reale con Prisma + PostgreSQL - Seed dei dati mock -
Test unitari aggiornati con mock - Ambiente di sviluppo aggiornato
(Node 20 LTS, PostgreSQL 18 installati e funzionanti)

Prossimi passi: 1. Meta Marketing API (dati reali al posto dei mock,
richiede un'app su Meta for Developers e un token di accesso) 2.
Frontend React (dashboard che consuma le API già pronte e documentate
su Swagger)

## Filosofia del progetto

Confermata dalle parti precedenti: l'obiettivo non è soltanto imparare
una tecnologia, ma sviluppare un prodotto con architettura
professionale, documentazione e una roadmap incrementale — inclusa la
capacità di diagnosticare e risolvere problemi di ambiente reali (Node,
PostgreSQL, PATH di sistema) che si incontrano in un progetto vero.
