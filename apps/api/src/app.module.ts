import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './common/auth/auth.module';
import { DegreeTemplatesModule } from './degreeTemplate/degree-template.module';
import { HealthModule } from './health/health.module';
import { ScoutDegreeModule } from './scoutDegree/scout-degree.module';
import { TroopMemberModule } from './troopMember/troop-member.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TroopMemberModule,
    AttendanceModule,
    DegreeTemplatesModule,
    ScoutDegreeModule,
    HealthModule,
  ],
})
export class AppModule {}
