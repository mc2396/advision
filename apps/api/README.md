# AdVision — API

Backend NestJS di AdVision. Per la panoramica completa del progetto (stack,
architettura, integrazione Meta) vedi il [README principale](../../README.md).

## Comandi rapidi

```bash
npm install
npm run start:dev          # avvia in watch mode su http://localhost:3000
npm test                   # esegue i test
npm run prisma:studio      # UI per ispezionare il database
npm run prisma:migrate     # crea/applica una migration
```

Documentazione API interattiva (Swagger): `http://localhost:3000/api`

## Struttura

```text
src/
├── campaigns/   # CRUD campagne (controller, service, DTO, entity)
├── meta/        # Sincronizzazione con Meta Marketing API
└── prisma/      # Wrapper di PrismaClient nel ciclo di vita NestJS
```

Variabili d'ambiente richieste: vedi `.env.example` in questa cartella e la
tabella nel README principale.
