import type { Campaign, CreateCampaignInput } from '../types/campaign';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface SyncResult {
  fetched: number;
  created: number;
  updated: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message ?? `Errore ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  // Le risposte 204 (delete) non hanno body
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const campaignsApi = {
  findAll: (): Promise<Campaign[]> =>
    fetch(`${API_URL}/campaigns`).then(handleResponse),

  create: (input: CreateCampaignInput): Promise<Campaign> =>
    fetch(`${API_URL}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then(handleResponse),

  update: (id: number, input: Partial<CreateCampaignInput>): Promise<Campaign> =>
    fetch(`${API_URL}/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then(handleResponse),

  remove: (id: number): Promise<void> =>
    fetch(`${API_URL}/campaigns/${id}`, { method: 'DELETE' }).then(
      handleResponse,
    ),
};

export const metaApi = {
  sync: (apiKey: string): Promise<SyncResult> =>
    fetch(`${API_URL}/meta/sync`, {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
    }).then(handleResponse),
};
