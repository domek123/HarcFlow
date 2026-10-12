import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { DegreeTemplatesModule } from './degreeTemplate/degree-template.module';
import { ScoutDegreeModule } from './scoutDegree/scout-degree.module';
import { TroopMemberModule } from './troopMember/troop-member.module';

@Module({
  imports: [
    PrismaModule,
    TroopMemberModule,
    AttendanceModule,
    DegreeTemplatesModule,
    ScoutDegreeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
