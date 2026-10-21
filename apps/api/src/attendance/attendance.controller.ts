import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { TroopMemberGuard } from '../common/auth/troop-member.guard';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly statisticsService: AttendanceService) {}

  @Get('stats/:troopId')
  @UseGuards(TroopMemberGuard)
  async getAttendanceStatistics(@Param('troopId') troopId: string) {
    return this.statisticsService.getAttendanceStatistics(troopId);
  }
}
