# AdVision - Diario di sviluppo (Parte 5)

## Obiettivo raggiunto

Integrazione con la **Meta Marketing API**: il backend può ora
sincronizzare le campagne reali di un ad account Meta nel database di
AdVision, al posto (o in aggiunta) ai dati creati manualmente.

## Modifiche allo schema Prisma

Aggiunto un campo alla tabella `campaigns`:

``` prisma
model Campaign {
  ...
  externalId String? @unique // ID della campagna su Meta, null se creata solo in AdVision
  ...
}
```

Serve a collegare una riga locale alla campagna reale su Meta, ed è la
chiave usata per capire se una campagna va creata o aggiornata durante
la sincronizzazione.

Migration applicata:

``` bash
npm run prisma:migrate -- --name add_external_id
```

## Nuovo modulo `Meta`

Struttura creata in `src/meta/`:

    meta/
    ├── meta.module.ts
    ├── meta.controller.ts
    ├── meta.service.ts
    ├── meta.types.ts
    ├── meta.service.spec.ts
    └── dto/
        └── sync-result.dto.ts

### Cosa fa `MetaService`

-   Chiama `GET /act_{adAccountId}/campaigns` sulla Graph API di Meta
    (versione `v25.0`), richiedendo `id, name, status, daily_budget,
    lifetime_budget` e gli insight (`spend`, `ctr`) sul periodo
    massimo disponibile
-   Mappa lo status di Meta (`ACTIVE`, `PAUSED`, `DELETED`,
    `ARCHIVED`, ...) sul nostro enum `CampaignStatus`
-   Converte il budget, che Meta restituisce come stringa nella unità
    minima della valuta (es. centesimi), dividendo per 100
-   Fa **upsert** su Prisma usando `externalId` come chiave: se la
    campagna esiste già la aggiorna, altrimenti la crea

### Endpoint esposto

    POST /meta/sync

Restituisce un riepilogo (`fetched`, `created`, `updated`),
documentato anche su Swagger.

### Configurazione richiesta (`.env`)

``` text
META_ACCESS_TOKEN="il-tuo-access-token"
META_AD_ACCOUNT_ID="act_1234567890"
META_API_VERSION="v25.0"
```

### Test

`meta.service.spec.ts` copre, con `fetch` e Prisma mockati (nessuna
chiamata reale a Meta durante i test):

-   creazione di una nuova campagna locale per un `externalId` non
    ancora visto
-   aggiornamento di una campagna esistente trovata per `externalId`
-   mapping di uno status Meta non gestito esplicitamente (fallback a
    `PAUSED`)

## Frontend

Aggiunto un pulsante **"Sincronizza da Meta"** nell'header della
dashboard:

-   chiama `POST /meta/sync` tramite il nuovo `metaApi.sync()` in
    `lib/api.ts`
-   mostra un'icona che ruota durante il caricamento
-   al termine mostra un messaggio con l'esito ("N campagne lette — X
    nuove, Y aggiornate")
-   in caso di errore (es. credenziali mancanti) mostra il messaggio
    restituito dal backend, senza bloccare il resto della dashboard

## Nota sulla sicurezza

Prima di collegare l'account Meta reale è stata fatta una verifica
esplicita di dove finisce il token:

-   `META_ACCESS_TOKEN` resta sempre lato backend, letto da
    `MetaService`; il frontend chiama solo `POST /meta/sync` e non lo
    vede mai
-   `.env` è escluso da Git fin dall'inizio del progetto
    (`.gitignore`)
-   I log di errore (`Logger.error`) riportano solo il messaggio
    d'errore di Meta, mai il token o l'URL completo con la query
    string

Punti aperti, da considerare prima di un eventuale deploy pubblico (non
rilevanti finché il progetto gira solo in locale):

-   `POST /meta/sync` non ha ancora autenticazione propria
-   si consiglia di generare il token con permesso `ads_read` soltanto
    (mai `ads_management`) per i test

## Problemi di setup risolti in questa sessione

-   **Tipi TS non aggiornati dopo la migration**: la migration aggiorna
    il database ma non rigenera automaticamente i tipi del Prisma
    Client. Risolto con `npm run prisma:generate`.
-   **`EADDRINUSE` sulla porta 3000**: causato da un vecchio processo
    `start:dev` rimasto attivo in un altro terminale. Risolto
    individuando il PID con `netstat -ano | findstr :3000` e
    terminandolo con `taskkill /PID ... /F`.
-   **`MetaModule` non caricato**: i file del modulo non erano stati
    ancora copiati/salvati localmente. Risolto verificando il
    contenuto di `src/meta/` e l'import di `MetaModule` in
    `app.module.ts`.

## Stato attuale del progetto

Completato: - Backend NestJS - Endpoint `/health` - Modulo Campaigns
con CRUD completo - DTO con validazione - Documentazione Swagger su
`/api` - Persistenza reale con Prisma + PostgreSQL - Frontend React con
dashboard e CRUD completo in UI - Modulo Meta pronto per sincronizzare
campagne reali (`POST /meta/sync`), testato con successo lato server
(route mappata, gestione errori controllata quando le credenziali non
sono ancora configurate)

In sospeso, per scelta consapevole: - Collegamento delle credenziali
Meta reali (`META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`), rimandato
finché non si è sicuri della sicurezza del flusso

Prossimi passi possibili: 1. Collegare le credenziali Meta reali e
testare la prima sincronizzazione end-to-end 2. Aggiungere
autenticazione a `POST /meta/sync` in vista di un eventuale deploy 3.
Eventuali step successivi della roadmap (deploy, autenticazione utenti
AdVision, reportistica avanzata)
