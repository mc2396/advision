export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface Campaign {
  id: number;
  name: string;
  status: CampaignStatus;
  budget: number;
  spend: number;
  ctr: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignInput {
  name: string;
  status?: CampaignStatus;
  budget: number;
  spend?: number;
  ctr?: number;
}
