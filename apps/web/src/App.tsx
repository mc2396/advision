import { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import type { Campaign, CreateCampaignInput } from './types/campaign';
import { campaignsApi, metaApi } from './lib/api';
import { StatsTicker } from './components/StatsTicker';
import { SpendChart } from './components/SpendChart';
import { CampaignsTable } from './components/CampaignsTable';
import { CampaignFormModal } from './components/CampaignFormModal';
import { SyncKeyModal } from './components/SyncKeyModal';

type LoadState = 'loading' | 'ready' | 'error';

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // undefined = modal chiuso, null = modal aperto in creazione,
  // Campaign = modal aperto in modifica di quella campagna
  const [editingCampaign, setEditingCampaign] = useState<
    Campaign | null | undefined
  >(undefined);

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [showSyncKeyModal, setShowSyncKeyModal] = useState(false);

  const loadCampaigns = useCallback(() => {
    setState('loading');
    return campaignsApi
      .findAll()
      .then((data) => {
        setCampaigns(data);
        setState('ready');
      })
      .catch((err) => {
        setErrorMessage(err.message ?? 'Errore sconosciuto');
        setState('error');
      });
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  async function handleCreateOrUpdate(input: CreateCampaignInput) {
    if (editingCampaign) {
      await campaignsApi.update(editingCampaign.id, input);
    } else {
      await campaignsApi.create(input);
    }
    setEditingCampaign(undefined);
    await loadCampaigns();
  }

  async function handleDelete(id: number) {
    await campaignsApi.remove(id);
    await loadCampaigns();
  }

  async function handleSync(apiKey: string) {
    setShowSyncKeyModal(false);
    setSyncing(true);
    setSyncMessage('');
    try {
      const result = await metaApi.sync(apiKey);
      setSyncMessage(
        `${result.fetched} campagne lette da Meta — ${result.created} nuove, ${result.updated} aggiornate.`,
      );
      await loadCampaigns();
    } catch (err) {
      setSyncMessage(
        err instanceof Error
          ? `Sincronizzazione fallita: ${err.message}`
          : 'Sincronizzazione fallita.',
      );
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-8 py-6">
        <div>
          <h1 className="font-display text-lg font-semibold text-chalk">
            AdVision
          </h1>
          <p className="font-body text-xs text-ash">
            Campaign console — Meta Ads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSyncKeyModal(true)}
            disabled={syncing}
            className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 font-body text-sm font-medium text-chalk hover:bg-surface-hover disabled:opacity-60"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Sincronizzazione...' : 'Sincronizza da Meta'}
          </button>
          <button
            onClick={() => setEditingCampaign(null)}
            className="flex items-center gap-1.5 rounded-md bg-amber px-4 py-2 font-body text-sm font-medium text-ink hover:bg-amber/90"
          >
            <Plus size={16} />
            Nuova campagna
          </button>
        </div>
      </header>

      {syncMessage && (
        <div className="mx-auto mt-4 max-w-5xl px-8">
          <p className="font-body text-xs text-ash">{syncMessage}</p>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-8 py-8">
        {state === 'loading' && (
          <p className="font-body text-sm text-ash">
            Caricamento campagne...
          </p>
        )}

        {state === 'error' && (
          <div className="rounded-lg border border-alert/40 bg-alert/10 px-5 py-4">
            <p className="font-display text-sm font-medium text-alert">
              Impossibile caricare le campagne
            </p>
            <p className="mt-1 font-body text-xs text-ash">
              {errorMessage}. Verifica che il backend sia in esecuzione su{' '}
              <code className="font-mono">http://localhost:3000</code>.
            </p>
          </div>
        )}

        {state === 'ready' && (
          <div className="flex flex-col gap-6">
            <StatsTicker campaigns={campaigns} />
            <SpendChart campaigns={campaigns} />
            <CampaignsTable
              campaigns={campaigns}
              onEdit={(campaign) => setEditingCampaign(campaign)}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>

      {editingCampaign !== undefined && (
        <CampaignFormModal
          campaign={editingCampaign ?? undefined}
          onClose={() => setEditingCampaign(undefined)}
          onSubmit={handleCreateOrUpdate}
        />
      )}

      {showSyncKeyModal && (
        <SyncKeyModal
          onClose={() => setShowSyncKeyModal(false)}
          onSubmit={handleSync}
        />
      )}
    </div>
  );
}
