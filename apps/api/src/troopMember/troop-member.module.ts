import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../common/auth/auth.module';
import { TroopMemberController } from './troop-member.controller';
import { TroopMemberService } from './troop-member.service';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [TroopMemberController],
  providers: [TroopMemberService],
})
export class TroopMemberModule {}
