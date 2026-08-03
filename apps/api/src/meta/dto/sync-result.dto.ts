import { ApiProperty } from '@nestjs/swagger';

export class SyncResultDto {
  @ApiProperty({ example: 5, description: 'Campagne lette da Meta' })
  fetched: number;

  @ApiProperty({ example: 2, description: 'Campagne nuove create in AdVision' })
  created: number;

  @ApiProperty({ example: 3, description: 'Campagne esistenti aggiornate' })
  updated: number;
}
