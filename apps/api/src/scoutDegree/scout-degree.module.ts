import { Module } from '@nestjs/common';

import { ScoutDegreeController } from './scout-degree.controller';
import { ScoutDegreeService } from './scout-degree.service';

@Module({
  controllers: [ScoutDegreeController],
  providers: [ScoutDegreeService],
})
export class ScoutDegreeModule {}
