import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DegreeTemplatesController } from './degree-template.controller';
import { DegreeTemplatesService } from './degree-template.service';

@Module({
  imports: [ConfigModule],
  controllers: [DegreeTemplatesController],
  providers: [DegreeTemplatesService],
})
export class DegreeTemplatesModule {}
