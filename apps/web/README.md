# AdVision — Web

Frontend React della dashboard AdVision. Per la panoramica completa del
progetto vedi il [README principale](../../README.md).

## Comandi rapidi

```bash
npm install
npm run dev        # avvia su http://localhost:5173
npm run build       # build di produzione
```

Richiede il backend (`apps/api`) attivo su `http://localhost:3000` (o
sull'URL configurato in `VITE_API_URL`).

## Struttura

```text
src/
├── components/   # Componenti della dashboard (tabella, grafico, modali)
├── lib/api.ts    # Client tipizzato verso il backend
└── types/        # Tipi TypeScript condivisi (Campaign, ecc.)
```
