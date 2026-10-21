import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TroopLeaderGuard } from '../common/auth/troop-leader.guard';
import { TroopStaffGuard } from '../common/auth/troop-staff.guard';
import { CompleteScoutDegreeDto } from './dto/complete-scout-degree.dto';
import { CreateScoutDegreeTaskDto } from './dto/create-scout-degree-task.dto';
import { CreateScoutDegreeDto } from './dto/create-scout-degree.dto';
import { UpdateScoutDegreeTaskDto } from './dto/update-scout-degree-task.dto';
import { ScoutDegreeService } from './scout-degree.service';

@Controller('scout-degrees')
export class ScoutDegreeController {
  constructor(private readonly service: ScoutDegreeService) {}

  @Get(':scoutId')
  @UseGuards(TroopStaffGuard)
  findAll(@Param('scoutId', ParseUUIDPipe) scoutId: string) {
    return this.service.findAll(scoutId);
  }

  @Post(':scoutId')
  @UseGuards(TroopLeaderGuard)
  create(
    @Param('scoutId', ParseUUIDPipe) scoutId: string,
    @Body() dto: CreateScoutDegreeDto,
  ) {
    return this.service.create(scoutId, dto);
  }

  @Post(':scoutDegreeId/tasks')
  @UseGuards(TroopLeaderGuard)
  createTask(
    @Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string,
    @Body() dto: CreateScoutDegreeTaskDto,
  ) {
    return this.service.createTask(scoutDegreeId, dto);
  }

  @Patch(':scoutDegreeId/open')
  @UseGuards(TroopLeaderGuard)
  open(@Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string) {
    return this.service.open(scoutDegreeId);
  }

  @Patch(':scoutDegreeId/complete')
  @UseGuards(TroopLeaderGuard)
  complete(
    @Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string,
    @Body() body: CompleteScoutDegreeDto,
  ) {
    return this.service.complete(scoutDegreeId, body.orderNumber);
  }

  @Patch('tasks/:taskId')
  @UseGuards(TroopLeaderGuard)
  updateTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateScoutDegreeTaskDto,
  ) {
    return this.service.updateTask(taskId, dto);
  }

  @Delete('tasks/:taskId')
  @UseGuards(TroopLeaderGuard)
  deleteTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.service.deleteTask(taskId);
  }

  @Delete(':scoutDegreeId')
  @UseGuards(TroopLeaderGuard)
  deleteScoutDegree(
    @Param('scoutDegreeId', ParseUUIDPipe) scoutDegreeId: string,
  ) {
    return this.service.deleteScoutDegree(scoutDegreeId);
  }
}
