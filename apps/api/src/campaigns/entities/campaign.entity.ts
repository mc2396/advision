import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';

export class Campaign {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Estate 2026' })
  name: string;

  @ApiProperty({ enum: CampaignStatus, example: CampaignStatus.ACTIVE })
  status: CampaignStatus;

  @ApiProperty({ example: 500 })
  budget: number;

  @ApiProperty({ example: 210 })
  spend: number;

  @ApiProperty({ example: 4.2 })
  ctr: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
