import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Natale 2026', description: 'Nome della campagna' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: CampaignStatus,
    default: CampaignStatus.ACTIVE,
    description: 'Stato della campagna',
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus = CampaignStatus.ACTIVE;

  @ApiProperty({ example: 500, description: 'Budget totale in euro', minimum: 0 })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiPropertyOptional({ example: 0, description: 'Spesa attuale in euro', minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  spend?: number = 0;

  @ApiPropertyOptional({ example: 0, description: 'Click-through rate (%)', minimum: 0, maximum: 100, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ctr?: number = 0;
}
