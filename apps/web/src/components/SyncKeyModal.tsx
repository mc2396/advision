import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';

interface SyncKeyModalProps {
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

/**
 * Chiede la chiave API di sincronizzazione al momento, senza salvarla
 * da nessuna parte: non finisce in localStorage, non in variabili
 * d'ambiente del frontend, non in stato persistente. Vive solo per la
 * durata di questa singola chiamata.
 */
export function SyncKeyModal({ onClose, onSubmit }: SyncKeyModalProps) {
  const [apiKey, setApiKey] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;
    onSubmit(apiKey.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-chalk">
            Chiave di sincronizzazione
          </h2>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="text-ash hover:text-chalk"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 font-body text-xs text-ash">
          Inserisci la chiave configurata come <code className="font-mono">META_SYNC_API_KEY</code> nel
          backend. Non viene salvata: la useremo solo per questa sincronizzazione.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="password"
            autoFocus
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Chiave API"
            className="rounded-md border border-border bg-ink px-3 py-2 font-mono text-sm text-chalk outline-none focus:border-amber"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 font-body text-sm text-ash hover:text-chalk"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="rounded-md bg-amber px-4 py-2 font-body text-sm font-medium text-ink hover:bg-amber/90 disabled:opacity-60"
            >
              Sincronizza
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
