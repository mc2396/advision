# AdVision - Diario di sviluppo (Parte 2)

## Obiettivo raggiunto

Il backend NestJS è stato esteso con il primo modulo **Campaigns**.

### Concetti appresi

-   Architettura a moduli
-   Controller
-   Service
-   Separazione delle responsabilità

## Struttura

``` text
src/
└── campaigns/
    ├── campaigns.module.ts
    ├── campaigns.controller.ts
    ├── campaigns.service.ts
```

## Comandi

``` bash
nest g mo campaigns
nest g service campaigns
nest g controller campaigns
```

## Endpoint

`GET /campaigns`

Il controller richiama il service che restituisce dati mock.

## Campagne mock

-   Estate 2026
-   San Valentino
-   Black Friday (aggiunta successivamente)

## Stato progetto

Completato: - Backend NestJS - Endpoint /health - Modulo Campaigns -
Endpoint GET /campaigns - Tre campagne mock

Prossimi passi: 1. DTO 2. Swagger 3. Prisma 4. PostgreSQL 5. Meta
Marketing API 6. Frontend React
