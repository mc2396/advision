// Forma (parziale) della risposta di GET /act_{id}/campaigns
// con fields=id,name,status,daily_budget,lifetime_budget,insights.date_preset(maximum){spend,ctr}
// Vedi: https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group/

export interface MetaCampaignInsights {
  spend?: string; // valore monetario come stringa, es. "210.55"
  ctr?: string; // percentuale come stringa, es. "4.20"
}

export interface MetaCampaignRaw {
  id: string;
  name: string;
  status: string; // ACTIVE | PAUSED | DELETED | ARCHIVED | IN_PROCESS | WITH_ISSUES
  daily_budget?: string; // importo nella unità minima della valuta (es. centesimi)
  lifetime_budget?: string;
  insights?: {
    data: MetaCampaignInsights[];
  };
}

export interface MetaCampaignsResponse {
  data: MetaCampaignRaw[];
  paging?: {
    cursors?: { before?: string; after?: string };
    next?: string;
  };
}
