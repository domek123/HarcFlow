import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TroopMemberModule } from './troopMember/troop-member.module';
import { AttendanceModule } from './attendance/attendance.module';
import { DegreeTemplatesModule } from './degreeTemplate/degree-template.module';

@Module({
  imports: [
    PrismaModule,
    TroopMemberModule,
    AttendanceModule,
    DegreeTemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
