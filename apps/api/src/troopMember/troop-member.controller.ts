import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  Patch,
  ParseUUIDPipe,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Function } from '@prisma/client';

import { TroopAuthorizationService } from '../common/auth/troop-authorization.service';
import { TroopMemberGuard } from '../common/auth/troop-member.guard';
import { TroopStaffGuard } from '../common/auth/troop-staff.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TroopMemberService } from './troop-member.service';

import type { AuthenticatedRequest } from '../common/auth/auth.types';

@Controller('troop-members')
export class TroopMemberController {
  constructor(
    private readonly troopMemberService: TroopMemberService,
    private readonly authorization: TroopAuthorizationService,
  ) {}

  @Post()
  @UseGuards(TroopStaffGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMember(
    @Body() createMemberDto: CreateMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.authorization.assertCanAssignStaffFunction(
      request.user,
      createMemberDto.troopId,
      createMemberDto.function,
    );
    return this.troopMemberService.createMember(createMemberDto);
  }

  @Delete(':id')
  @UseGuards(TroopStaffGuard)
  deleteMember(@Param('id', ParseUUIDPipe) id: string) {
    return this.troopMemberService.deleteMember(id);
  }

  @Patch(':id')
  @UseGuards(TroopStaffGuard)
  async updateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const troopId = await this.authorization.getTroopIdForRequest(request);
    await this.authorization.assertCanAssignStaffFunction(
      request.user,
      troopId,
      dto.function ?? Function.NONE,
    );
    return this.troopMemberService.updateMember(id, dto);
  }

  @Get('section/:troopId')
  @UseGuards(TroopMemberGuard)
  getTroopMembersSection(@Param('troopId', ParseUUIDPipe) troopId: string) {
    return this.troopMemberService.getTroopMembersSection(troopId);
  }

  @Patch(':id/degree')
  @UseGuards(TroopStaffGuard)
  updateDegree(
    @Param('id', ParseUUIDPipe) profileId: string,
    @Body() body: UpdateDegreeDto,
  ) {
    const { degree, acquiringDegree } = body;
    return this.troopMemberService.updateDegree(
      profileId,
      degree,
      acquiringDegree,
    );
  }
}
