import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { TroopAuthorizationService } from './troop-authorization.service';

import type { AuthenticatedRequest } from './auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authorization: TroopAuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.authorization.getApplicationUser(request.user);
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Wymagane są uprawnienia administratora.');
    }
    return true;
  }
}
