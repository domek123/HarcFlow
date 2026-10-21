import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { PrismaModule } from '../../../prisma/prisma.module';
import { AdminGuard } from './admin.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SUPABASE_CLIENT } from './supabase.constants';
import { TroopAuthorizationService } from './troop-authorization.service';
import { TroopLeaderGuard } from './troop-leader.guard';
import { TroopMemberGuard } from './troop-member.guard';
import { TroopStaffGuard } from './troop-staff.guard';

function createSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL oraz SUPABASE_ANON_KEY lub SUPABASE_PUBLISHABLE_KEY są wymagane.',
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: SUPABASE_CLIENT, useFactory: createSupabaseClient },
    TroopAuthorizationService,
    AdminGuard,
    TroopLeaderGuard,
    TroopMemberGuard,
    TroopStaffGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [
    AdminGuard,
    TroopAuthorizationService,
    TroopLeaderGuard,
    TroopMemberGuard,
    TroopStaffGuard,
  ],
})
export class AuthModule {}
