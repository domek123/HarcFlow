import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';

import { CreateMemberDto } from './dto/create-member.dto';
import { TroopMemberService } from './troop-member.service';

@Controller('troop-members')
export class TroopMemberController {
  constructor(private readonly troopMemberService: TroopMemberService) {}

  @Post('members')
  @HttpCode(HttpStatus.CREATED)
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.troopMemberService.createMember(createMemberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteMember(@Param('id') id: string) {
    return this.troopMemberService.deleteMember(id);
  }
}