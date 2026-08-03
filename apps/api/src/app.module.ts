import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PrismaModule } from './prisma/prisma.module';
import { MetaModule } from './meta/meta.module';

@Module({
  imports: [PrismaModule, CampaignsModule, MetaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
