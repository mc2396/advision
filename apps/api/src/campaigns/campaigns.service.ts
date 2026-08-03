import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campagna con id ${id} non trovata`);
    }
    return campaign;
  }

  create(dto: CreateCampaignDto): Promise<Campaign> {
    return this.prisma.campaign.create({ data: dto });
  }

  async update(id: number, dto: UpdateCampaignDto): Promise<Campaign> {
    try {
      return await this.prisma.campaign.update({ where: { id }, data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Campagna con id ${id} non trovata`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.campaign.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Campagna con id ${id} non trovata`);
      }
      throw error;
    }
  }
}
