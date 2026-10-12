import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { DegreeTemplatesService } from './degree-template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('troops/:troopId/degree-templates')
export class DegreeTemplatesController {
  constructor(
    private readonly degreeTemplatesService: DegreeTemplatesService,
  ) {}

  @Post()
  create(
    @Param('troopId', ParseUUIDPipe) troopId: string,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.degreeTemplatesService.create(troopId, dto);
  }

  @Get()
  findAll(@Param('troopId', ParseUUIDPipe) troopId: string) {
    return this.degreeTemplatesService.findAll(troopId);
  }

  @Patch(':id')
  update(
    @Param('troopId', ParseUUIDPipe) troopId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.degreeTemplatesService.update(troopId, id, dto);
  }
}
