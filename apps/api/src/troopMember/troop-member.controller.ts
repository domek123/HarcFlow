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
} from '@nestjs/common';

import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TroopMemberService } from './troop-member.service';

@Controller('troop-members')
export class TroopMemberController {
  constructor(private readonly troopMemberService: TroopMemberService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.troopMemberService.createMember(createMemberDto);
  }

  @Delete(':id')
  deleteMember(@Param('id', ParseUUIDPipe) id: string) {
    return this.troopMemberService.deleteMember(id);
  }

  @Patch(':id')
  updateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.troopMemberService.updateMember(id, dto);
  }
}
