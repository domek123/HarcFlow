import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TroopMemberController } from './troop-member.controller';
import { TroopMemberService } from './troop-member.service';

@Module({imports: [
    ConfigModule,
  ],
  controllers: [TroopMemberController],
  providers: [TroopMemberService],
})
export class TroopMemberModule {}