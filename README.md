# AdVision

Console per monitorare e gestire campagne pubblicitarie Meta Ads (Facebook/
Instagram), con dati persistiti su PostgreSQL e sincronizzazione diretta
dalla Meta Marketing API.

![Stato](https://img.shields.io/badge/stato-in%20sviluppo-yellow)
![Node](https://img.shields.io/badge/node-20%20LTS-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Indice

- [Cosa fa](#cosa-fa)
- [Stack tecnologico](#stack-tecnologico)
- [Architettura](#architettura)
- [Struttura del repository](#struttura-del-repository)
- [Requisiti](#requisiti)
- [Setup](#setup)
  - [1. Database](#1-database)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Variabili d'ambiente](#variabili-dambiente)
- [Documentazione API](#documentazione-api)
- [Integrazione Meta Marketing API](#integrazione-meta-marketing-api)
- [Test](#test)
- [Roadmap / stato del progetto](#roadmap--stato-del-progetto)
- [Sicurezza](#sicurezza)
- [Licenza](#licenza)

---

## Cosa fa

AdVision permette di:

- visualizzare un cruscotto con budget, spesa e CTR aggregati su tutte le
  campagne
- creare, modificare ed eliminare campagne manualmente
- importare/aggiornare campagne reali da un ad account Meta con un click,
  tramite la Marketing API ufficiale

## Stack tecnologico

| Livello       | Tecnologia                          |
| ------------- | ------------------------------------ |
| Frontend      | React, TypeScript, Vite, Tailwind CSS, Chart.js |
| Backend       | NestJS, TypeScript                   |
| Database      | PostgreSQL, Prisma ORM               |
| Documentazione API | Swagger / OpenAPI (`@nestjs/swagger`) |
| Integrazione esterna | Meta Marketing API (Graph API)|

## Architettura

```text
┌─────────────────┐        REST API        ┌──────────────────┐        SQL        ┌──────────────┐
│  React (Vite)     │ ─────────────────────▶ │   NestJS API       │ ─────────────────▶ │  PostgreSQL   │
│  localhost:5173   │ ◀───────────────────── │   localhost:3000   │ ◀───────────────── │              │
└─────────────────┘                          └──────────────────┘                    └──────────────┘
                                                        │
                                                        │ Graph API (POST /meta/sync)
                                                        ▼
                                              ┌──────────────────┐
                                              │  Meta Marketing API │
                                              └──────────────────┘
```

## Struttura del repository

```text
advision/
├── apps/
│   ├── api/                  # Backend NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma # Modello dati (Campaign, CampaignStatus)
│   │   │   └── seed.ts       # Dati di esempio
│   │   └── src/
│   │       ├── campaigns/    # Modulo CRUD campagne (controller, service, DTO)
│   │       ├── meta/         # Integrazione Meta Marketing API
│   │       └── prisma/       # Wrapper di PrismaClient nel ciclo di vita NestJS
│   └── web/                  # Frontend React
│       └── src/
│           ├── components/   # Componenti della dashboard
│           └── lib/          # Client API verso il backend
├── docs/
│   └── diario/               # Diario di sviluppo, cronologico
└── packages/                 # Riservato a codice condiviso futuro
```

## Requisiti

- [Node.js 20 LTS](https://nodejs.org/) (o superiore)
- [PostgreSQL](https://www.postgresql.org/) 14+ in esecuzione, locale o remoto
- npm (incluso con Node.js)

## Setup

### 1. Database

Crea un database PostgreSQL vuoto chiamato `advision` (con `psql`, pgAdmin,
Docker, o il tool che preferisci).

### 2. Backend

```bash
cd apps/api
cp .env.example .env       # poi modifica .env con le tue credenziali
npm install                # scarica le dipendenze e genera il Prisma Client
npm run prisma:migrate -- --name init
npm run prisma:seed        # facoltativo, popola con campagne di esempio
npm run start:dev
```

Il backend parte su `http://localhost:3000`.

### 3. Frontend

In un secondo terminale:

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev
```

Il frontend parte su `http://localhost:5173`.

## Variabili d'ambiente

### `apps/api/.env`

| Variabile | Obbligatoria | Descrizione |
| --- | --- | --- |
| `DATABASE_URL` | Sì | Stringa di connessione PostgreSQL, es. `postgresql://user:pass@localhost:5432/advision?schema=public` |
| `CORS_ORIGIN` | Sì (per usare il frontend) | Origine autorizzata a chiamare l'API, es. `http://localhost:5173` |
| `META_ACCESS_TOKEN` | Solo per la sync Meta | Access token della Marketing API, permesso `ads_read` |
| `META_AD_ACCOUNT_ID` | Solo per la sync Meta | ID dell'ad account, formato `act_1234567890` |
| `META_API_VERSION` | No (default `v25.0`) | Versione della Graph API da usare |
| `META_SYNC_API_KEY` | Solo per la sync Meta | Chiave condivisa richiesta per autorizzare `POST /meta/sync` |

### `apps/web/.env`

| Variabile | Obbligatoria | Descrizione |
| --- | --- | --- |
| `VITE_API_URL` | Sì | URL base del backend, es. `http://localhost:3000` |

Un file `.env.example` è presente in entrambe le cartelle come riferimento.
**I file `.env` reali non vengono mai committati** (sono in `.gitignore`).

## Documentazione API

Con il backend in esecuzione, la documentazione interattiva Swagger è su:

```text
http://localhost:3000/api
```

Da lì puoi consultare ed eseguire ogni endpoint direttamente dal browser.

## Integrazione Meta Marketing API

L'endpoint `POST /meta/sync` legge le campagne dall'ad account configurato e
le allinea nel database locale (crea le nuove, aggiorna le esistenti,
confrontandole tramite l'ID reale della campagna su Meta).

Per usarlo:

1. Crea un'app su [Meta for Developers](https://developers.facebook.com/) e
   abilita il prodotto **Marketing API**
2. Genera un access token con permesso **`ads_read`** (evita
   `ads_management` a meno che tu non ne abbia davvero bisogno: con
   `ads_read` il token può solo leggere, mai modificare o spendere budget)
3. Recupera il tuo Ad Account ID da Meta Ads Manager (formato `act_...`)
4. Compila `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` nel `.env` del backend
5. Scegli una `META_SYNC_API_KEY` (una stringa lunga e casuale)
6. Dalla dashboard, clicca **"Sincronizza da Meta"**: ti verrà chiesta la
   chiave scelta al punto 5 prima di procedere

## Test

```bash
cd apps/api
npm test
```

Copre il modulo Campaigns (CRUD), il modulo Meta (mapping e sincronizzazione,
con chiamate Meta mockate — nessun test tocca la Graph API reale) e il guard
di autenticazione su `/meta/sync`.

## Roadmap / stato del progetto

- [x] Backend NestJS con endpoint `/health`
- [x] Modulo Campaigns con CRUD completo
- [x] Validazione input con DTO (`class-validator`)
- [x] Documentazione Swagger
- [x] Persistenza con Prisma + PostgreSQL
- [x] Frontend React con dashboard, CRUD in UI
- [x] Integrazione Meta Marketing API con sincronizzazione protetta
- [ ] Autenticazione utenti (login) — oggi l'app non ha gestione utenti,
      pensata per uso locale/singolo utente
- [ ] Deploy in produzione

## Sicurezza

Alcuni punti da tenere presenti, in particolare se in futuro questo progetto
viene esposto oltre `localhost`:

- `POST /meta/sync` richiede una chiave condivisa (`META_SYNC_API_KEY`), non
  un sistema di autenticazione utenti completo
- Non c'è login: chiunque abbia accesso all'app in esecuzione può vedere e
  modificare tutte le campagne
- I file `.env` non vanno mai committati; usa sempre `.env.example` come
  riferimento e tieni le credenziali reali solo in locale

Se trovi un problema di sicurezza, per un progetto personale come questo
puoi semplicemente annotarlo nel diario di sviluppo (`docs/diario/`) prima
di eventuali passi verso un deploy pubblico.

## Licenza

MIT — vedi [LICENSE](./LICENSE).
