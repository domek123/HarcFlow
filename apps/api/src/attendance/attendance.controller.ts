import { Controller, Get, Param } from '@nestjs/common';

import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly statisticsService: AttendanceService) {}

  @Get('stats/:troopId')
  async getAttendanceStatistics(@Param('troopId') troopId: string) {
    return this.statisticsService.getAttendanceStatistics(troopId);
  }
}
