# AdVision - Diario di sviluppo (Parte 6)

## Obiettivo raggiunto

Il progetto è stato documentato e pubblicato su GitHub:
`https://github.com/mc2396/advision`

## Problema scoperto: repository Git annidata

Il comando `nest new .`, eseguito all'inizio del progetto per creare il
backend, aveva silenziosamente inizializzato una **sua propria repository
Git dentro `apps/api`** — annidata dentro quella principale del progetto
(`advision/.git`).

Se non corretto, questo avrebbe fatto sì che, una volta pubblicato su
GitHub, `apps/api` comparisse come una cartella vuota o come un
collegamento simil-submodule, invece di mostrare i suoi file normalmente.

**Risolto** rimuovendo la cartella `apps/api/.git`:

``` bash
cd apps/api
rmdir /s /q .git
```

## Documentazione aggiunta

### README principale (`README.md`)

Riscritto da zero, ora include:

-   Descrizione del progetto e badge di stato
-   Tabella dello stack tecnologico
-   Diagramma ASCII dell'architettura (frontend → backend → database,
    più il collegamento verso la Meta Marketing API)
-   Struttura del repository commentata
-   Istruzioni di setup passo-passo (database, backend, frontend)
-   Tabella completa delle variabili d'ambiente, per entrambe le app
-   Sezione dedicata all'integrazione Meta (permessi consigliati,
    passaggi per ottenere le credenziali)
-   Come lanciare i test
-   Checklist della roadmap con stato attuale
-   Sezione sicurezza, con i limiti noti dell'app allo stato attuale

### README per sottocartella

Aggiunti `apps/api/README.md` e `apps/web/README.md`, brevi, con i
comandi rapidi di ciascuna app e link al README principale. Quello di
`apps/api` sostituisce il README generico creato di default da
`nest new .`.

### Licenza

Aggiunto `LICENSE` (MIT).

### `.gitignore` principale

Esteso rispetto alla versione iniziale, ora copre anche:

-   `.vite/` (cache di Vite)
-   `Thumbs.db` (equivalente Windows di `.DS_Store`)
-   file di log
-   cartelle di editor (`.vscode/`, `.idea/`) con eccezioni per i file
    di configurazione condivisibili

## Pubblicazione su GitHub

### Verifica pre-pubblicazione

Prima di qualunque commit, verificato con:

``` bash
git add --dry-run -A .
```

che nessun file `.env` reale finisse tra i file tracciati (solo i due
`.env.example` comparivano nell'elenco, come previsto).

### Nota: cartella `prisma/migrations` non presente

Nell'elenco dei file da aggiungere non compare `prisma/migrations/`,
perché quella cartella era già andata persa in precedenza (durante
l'estrazione di uno zip con l'opzione "sovrascrivi tutto") ed era
stata sistemata con `prisma db push` invece che con una migration
tracciata. Non blocca nulla, ma resta un debito tecnico noto: lo
storico delle migration potrà essere ricostruito in futuro con
`prisma migrate dev` a partire da qui.

### Setup Git sulla macchina

Git risultava annotato come già installato nel diario iniziale, ma non
era raggiungibile dal terminale (stessa dinamica già vista con `nvm` in
una sessione precedente) - risolto verificando l'installazione e il
PATH.

### Autenticazione

Il primo tentativo di push ha usato l'URL SSH
(`git@github.com:mc2396/advision.git`), fallito con `Permission denied
(publickey)` per assenza di una chiave SSH configurata. Risolto
passando all'URL HTTPS:

``` bash
git remote set-url origin https://github.com/mc2396/advision.git
```

L'autenticazione è stata completata tramite il flusso **"Sign in with
your browser"** di Git Credential Manager, senza dover generare e
maneggiare manualmente un Personal Access Token.

### Push completato

``` bash
git add .
git commit -m "docs: aggiunge README completo, licenza e pulizia gitignore"
git remote add origin https://github.com/mc2396/advision.git
git branch -M main
git remote set-url origin https://github.com/mc2396/advision.git
git push -u origin main
```

Risultato: `* [new branch] main -> main`, repository pubblicata con
successo.

### Verifiche post-pubblicazione

Controllato direttamente su GitHub che:

-   il README si visualizzi formattato correttamente nella pagina
    principale del repository
-   nessun file `.env` compaia tra i file del repository
-   `apps/api` mostri tutti i suoi file sorgente normalmente (conferma
    che la rimozione della repo Git annidata ha funzionato)

## Stato attuale del progetto

Completato: - Backend NestJS - Endpoint `/health` - Modulo Campaigns
con CRUD completo - DTO con validazione - Documentazione Swagger su
`/api` - Persistenza reale con Prisma + PostgreSQL - Frontend React con
dashboard e CRUD completo in UI - Modulo Meta pronto per sincronizzare
campagne reali, protetto da chiave API - Documentazione completa
(README principale + per sottocartella, licenza MIT) - Pubblicato su
GitHub: `https://github.com/mc2396/advision`

In sospeso, per scelta consapevole: - Collegamento delle credenziali
Meta reali, rimandato finché non si è sicuri della sicurezza del
flusso

Prossimi passi possibili: 1. Collegare le credenziali Meta reali e
testare la prima sincronizzazione end-to-end 2. Ricostruire lo storico
delle migration Prisma da questo punto in poi 3. Autenticazione utenti
vera, in vista di un eventuale deploy pubblico 4. Deploy
