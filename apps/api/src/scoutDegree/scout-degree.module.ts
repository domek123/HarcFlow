import { Module } from '@nestjs/common';

import { AuthModule } from '../common/auth/auth.module';
import { ScoutDegreeController } from './scout-degree.controller';
import { ScoutDegreeService } from './scout-degree.service';

@Module({
  imports: [AuthModule],
  controllers: [ScoutDegreeController],
  providers: [ScoutDegreeService],
})
export class ScoutDegreeModule {}
