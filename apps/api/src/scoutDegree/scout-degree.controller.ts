import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CompleteScoutDegreeDto } from './dto/complete-scout-degree.dto';
import { CreateScoutDegreeTaskDto } from './dto/create-scout-degree-task.dto';
import { CreateScoutDegreeDto } from './dto/create-scout-degree.dto';
import { UpdateScoutDegreeTaskDto } from './dto/update-scout-degree-task.dto';
import { ScoutDegreeService } from './scout-degree.service';

@Controller('scout-degrees')
export class ScoutDegreeController {
  constructor(private readonly service: ScoutDegreeService) {}

  @Get(':scoutId')
  findAll(@Param('scoutId', ParseUUIDPipe) scoutId: string) {
    return this.service.findAll(scoutId);
  }

  @Post(':scoutId')
  create(
    @Param('scoutId', ParseUUIDPipe) scoutId: string,
    @Body() dto: CreateScoutDegreeDto,
  ) {
    return this.service.create(scoutId, dto);
  }

  @Post(':scoutDegreeId/tasks')
  createTask(
    @Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string,
    @Body() dto: CreateScoutDegreeTaskDto,
  ) {
    return this.service.createTask(scoutDegreeId, dto);
  }

  @Patch(':scoutDegreeId/open')
  open(@Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string) {
    return this.service.open(scoutDegreeId);
  }

  @Patch(':scoutDegreeId/complete')
  complete(
    @Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string,
    @Body() body: CompleteScoutDegreeDto,
  ) {
    return this.service.complete(scoutDegreeId, body.orderNumber);
  }

  @Patch('tasks/:taskId')
  updateTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateScoutDegreeTaskDto,
  ) {
    return this.service.updateTask(taskId, dto);
  }

  @Delete('tasks/:taskId')
  deleteTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.service.deleteTask(taskId);
  }

  @Delete(':scoutDegreeId')
  deleteScoutDegree(
    @Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string,
  ) {
    return this.service.deleteScoutDegree(scoutDegreeId);
  }
}
