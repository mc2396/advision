import { Controller, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiHeader,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MetaService } from './meta.service';
import { SyncResultDto } from './dto/sync-result.dto';
import { ApiKeyGuard } from './guards/api-key.guard';

@ApiTags('meta')
@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary:
      'Sincronizza le campagne da Meta Ads verso il database di AdVision',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'Deve corrispondere a META_SYNC_API_KEY nel .env del backend',
    required: true,
  })
  @ApiOkResponse({ type: SyncResultDto })
  @ApiUnauthorizedResponse({ description: 'Chiave API mancante o non valida' })
  sync(): Promise<SyncResultDto> {
    return this.metaService.syncCampaigns();
  }
}
