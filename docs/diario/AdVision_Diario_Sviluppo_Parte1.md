# AdVision - Diario di sviluppo (Parte 1)

## Obiettivo del progetto

Realizzare una piattaforma SaaS per analizzare e gestire campagne Meta
Ads.

### Stack scelto

-   TypeScript
-   Node.js
-   NestJS (backend)
-   React (frontend)
-   PostgreSQL
-   Prisma ORM
-   Tailwind CSS
-   Chart.js
-   Git

## Perché questa stack

Abbiamo scelto TypeScript perché offre maggiore sicurezza grazie alla
tipizzazione. NestJS fornisce un'architettura modulare e professionale,
ideale per API REST. React verrà usato per costruire una dashboard
moderna e interattiva.

## Architettura prevista

``` text
React (Frontend)
        │
 REST API (NestJS)
        │
 PostgreSQL
        │
 Meta Marketing API
```

## Organizzazione del repository

``` text
advision/
│
├── apps/
│   ├── api/
│   └── web/
├── packages/
├── docs/
└── README.md
```

## Ambiente di sviluppo

Sistema operativo: - Windows 10 Pro

Software installato: - Node.js v18.13.0 - npm 8.19.3 - Git 2.40.1 -
Visual Studio Code

## Operazioni svolte

### 1. Creazione del repository

``` bash
mkdir advision
cd advision
git init
```

### 2. Creazione della struttura

``` text
apps/
packages/
docs/
README.md
```

### 3. Creazione del `.gitignore`

Contiene:

``` text
node_modules
dist
.env
.DS_Store
coverage
```

### 4. Creazione del README

Descrive il progetto, lo stack tecnologico e l'obiettivo generale.

### 5. Primo commit Git

``` bash
git add .
git commit -m "init project structure"
```

## Backend

È stato deciso di partire dal backend per costruire prima le API che il
frontend consumerà.

### Installazione NestJS

``` bash
cd apps/api
npm install -g @nestjs/cli
nest new .
```

Package manager: - npm

### Avvio del server

``` bash
npm run start:dev
```

L'applicazione è disponibile su:

    http://localhost:3000

### Primo endpoint

Endpoint:

    GET /health

Risposta prevista:

``` json
{
  "status": "ok",
  "app": "AdVision API",
  "time": "2026-07-08T..."
}
```

Questo endpoint serve a verificare che il backend sia in esecuzione
correttamente.

## Roadmap immediata

1.  Creare il modulo Campaigns.
2.  Esporre l'endpoint `GET /campaigns`.
3.  Restituire dati mock.
4.  Collegare successivamente le API di Meta.
5.  Integrare PostgreSQL e Prisma.
6.  Costruire la dashboard React.

## Filosofia del progetto

L'obiettivo non è soltanto imparare una tecnologia, ma sviluppare un
prodotto con un'architettura professionale, documentazione e una roadmap
incrementale.
