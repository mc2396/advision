import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'Elenca tutte le campagne' })
  @ApiOkResponse({ type: Campaign, isArray: true })
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera una campagna per id' })
  @ApiOkResponse({ type: Campaign })
  @ApiNotFoundResponse({ description: 'Campagna non trovata' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nuova campagna' })
  @ApiCreatedResponse({ type: Campaign })
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna parzialmente una campagna' })
  @ApiOkResponse({ type: Campaign })
  @ApiNotFoundResponse({ description: 'Campagna non trovata' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina una campagna' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Campagna non trovata' })
  remove(@Param('id', ParseIntPipe) id: number) {
    this.campaignsService.remove(id);
  }
}
