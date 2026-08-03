import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export function RowActions({ onEdit, onDelete }: RowActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="font-body text-xs text-ash">Eliminare?</span>
        <button
          onClick={async () => {
            setDeleting(true);
            await onDelete();
          }}
          disabled={deleting}
          className="rounded px-2 py-1 font-body text-xs font-medium text-alert hover:bg-alert/10 disabled:opacity-60"
        >
          {deleting ? '...' : 'Conferma'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded px-2 py-1 font-body text-xs text-ash hover:text-chalk"
        >
          Annulla
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={onEdit}
        aria-label="Modifica"
        className="rounded p-1.5 text-ash hover:bg-surface-hover hover:text-chalk"
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={() => setConfirming(true)}
        aria-label="Elimina"
        className="rounded p-1.5 text-ash hover:bg-alert/10 hover:text-alert"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
