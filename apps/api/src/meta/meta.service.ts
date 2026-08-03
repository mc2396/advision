import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CampaignStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MetaCampaignRaw, MetaCampaignsResponse } from './meta.types';
import { SyncResultDto } from './dto/sync-result.dto';

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(private readonly prisma: PrismaService) {}

  private get apiVersion(): string {
    return process.env.META_API_VERSION ?? 'v25.0';
  }

  private get adAccountId(): string {
    const id = process.env.META_AD_ACCOUNT_ID;
    if (!id) {
      throw new InternalServerErrorException(
        'META_AD_ACCOUNT_ID non configurato nel .env',
      );
    }
    // Accetta sia "act_123..." che "123..." per comodità
    return id.startsWith('act_') ? id : `act_${id}`;
  }

  private get accessToken(): string {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) {
      throw new InternalServerErrorException(
        'META_ACCESS_TOKEN non configurato nel .env',
      );
    }
    return token;
  }

  /**
   * Legge le campagne dell'ad account da Meta, con budget e insight
   * (spesa, CTR) sull'intero periodo di vita della campagna.
   */
  private async fetchCampaignsFromMeta(): Promise<MetaCampaignRaw[]> {
    const fields = [
      'id',
      'name',
      'status',
      'daily_budget',
      'lifetime_budget',
      'insights.date_preset(maximum){spend,ctr}',
    ].join(',');

    const url =
      `https://graph.facebook.com/${this.apiVersion}/${this.adAccountId}/campaigns` +
      `?fields=${encodeURIComponent(fields)}&access_token=${this.accessToken}`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      this.logger.error('Errore di rete verso la Graph API di Meta', error);
      throw new BadGatewayException(
        'Impossibile raggiungere la Graph API di Meta',
      );
    }

    const body = await response.json();

    if (!response.ok) {
      const message = body?.error?.message ?? 'Errore sconosciuto da Meta';
      this.logger.error(`Meta API error: ${message}`);
      throw new BadGatewayException(`Meta API: ${message}`);
    }

    return (body as MetaCampaignsResponse).data ?? [];
  }

  /** Converte lo status Meta nel nostro enum CampaignStatus. */
  private mapStatus(metaStatus: string): CampaignStatus {
    switch (metaStatus) {
      case 'ACTIVE':
        return CampaignStatus.ACTIVE;
      case 'PAUSED':
        return CampaignStatus.PAUSED;
      case 'DELETED':
      case 'ARCHIVED':
        return CampaignStatus.ARCHIVED;
      default:
        // IN_PROCESS, WITH_ISSUES, o stati futuri non gestiti esplicitamente
        return CampaignStatus.PAUSED;
    }
  }

  /**
   * Il budget di Meta è espresso nella unità minima della valuta
   * (es. centesimi per EUR/USD) come stringa. Preferiamo il lifetime
   * budget se presente, altrimenti il daily budget.
   */
  private mapBudget(campaign: MetaCampaignRaw): number {
    const raw = campaign.lifetime_budget ?? campaign.daily_budget;
    if (!raw) return 0;
    return Number(raw) / 100;
  }

  private mapInsights(campaign: MetaCampaignRaw): {
    spend: number;
    ctr: number;
  } {
    const insight = campaign.insights?.data?.[0];
    return {
      spend: insight?.spend ? Number(insight.spend) : 0,
      ctr: insight?.ctr ? Number(insight.ctr) : 0,
    };
  }

  /**
   * Sincronizza le campagne di Meta nel database locale: crea quelle
   * nuove (per externalId) e aggiorna quelle già esistenti.
   */
  async syncCampaigns(): Promise<SyncResultDto> {
    const rawCampaigns = await this.fetchCampaignsFromMeta();

    let created = 0;
    let updated = 0;

    for (const raw of rawCampaigns) {
      const { spend, ctr } = this.mapInsights(raw);
      const data = {
        name: raw.name,
        status: this.mapStatus(raw.status),
        budget: this.mapBudget(raw),
        spend,
        ctr,
        externalId: raw.id,
      };

      const existing = await this.prisma.campaign.findUnique({
        where: { externalId: raw.id },
      });

      if (existing) {
        await this.prisma.campaign.update({
          where: { externalId: raw.id },
          data,
        });
        updated++;
      } else {
        await this.prisma.campaign.create({ data });
        created++;
      }
    }

    return { fetched: rawCampaigns.length, created, updated };
  }
}
