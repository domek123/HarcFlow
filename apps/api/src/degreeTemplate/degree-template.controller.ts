import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TroopLeaderGuard } from '../common/auth/troop-leader.guard';
import { TroopMemberGuard } from '../common/auth/troop-member.guard';
import { DegreeTemplatesService } from './degree-template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
@Controller('troops/:troopId/degree-templates')
export class DegreeTemplatesController {
  constructor(
    private readonly degreeTemplatesService: DegreeTemplatesService,
  ) {}

  @Post()
  @UseGuards(TroopLeaderGuard)
  create(
    @Param('troopId', ParseUUIDPipe) troopId: string,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.degreeTemplatesService.create(troopId, dto);
  }

  @Get()
  @UseGuards(TroopMemberGuard)
  findAll(@Param('troopId', ParseUUIDPipe) troopId: string) {
    return this.degreeTemplatesService.findAll(troopId);
  }

  @Patch(':id')
  @UseGuards(TroopLeaderGuard)
  update(
    @Param('troopId', ParseUUIDPipe) troopId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.degreeTemplatesService.update(troopId, id, dto);
  }
}
