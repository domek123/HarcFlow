import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { TroopAuthorizationService } from './troop-authorization.service';

import type { AuthenticatedRequest } from './auth.types';

@Injectable()
export class TroopLeaderGuard implements CanActivate {
  constructor(private readonly authorization: TroopAuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.authorization.getApplicationUser(request.user);
    const troopId = await this.authorization.getTroopIdForRequest(request);
    this.authorization.assertLeader(user, troopId);
    return true;
  }
}
