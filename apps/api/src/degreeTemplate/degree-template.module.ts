import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../common/auth/auth.module';
import { DegreeTemplatesController } from './degree-template.controller';
import { DegreeTemplatesService } from './degree-template.service';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [DegreeTemplatesController],
  providers: [DegreeTemplatesService],
})
export class DegreeTemplatesModule {}
