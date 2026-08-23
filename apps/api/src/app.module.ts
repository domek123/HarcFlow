import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TroopMemberModule } from './troopMember/troop-member.module';

@Module({
  imports: [PrismaModule, TroopMemberModule],
  controllers: [AppController, ],
  providers: [AppService],
})
export class AppModule {}
