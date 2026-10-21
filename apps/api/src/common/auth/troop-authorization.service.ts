import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Function, Role } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';

import type { AuthenticatedUser } from './auth.types';

type ApplicationUser = {
  id: string;
  role: Role;
  scoutProfile: {
    troopId: string;
    function: Function;
    isActive: boolean;
  } | null;
};

@Injectable()
export class TroopAuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getApplicationUser(
    authUser: AuthenticatedUser,
  ): Promise<ApplicationUser> {
    const user = await this.prisma.user.findUnique({
      where: { authUserId: authUser.id },
      select: {
        id: true,
        role: true,
        scoutProfile: {
          select: { troopId: true, function: true, isActive: true },
        },
      },
    });

    if (!user) {
      throw new ForbiddenException('Użytkownik nie ma profilu aplikacji.');
    }

    return user;
  }

  async getTroopIdForRequest(request: {
    params: Record<string, string | string[] | undefined>;
    body?: Record<string, unknown>;
  }): Promise<string> {
    const directTroopId = request.params.troopId;
    if (typeof directTroopId === 'string') {
      return directTroopId;
    }

    const bodyTroopId = request.body?.troopId;
    if (typeof bodyTroopId === 'string') {
      return bodyTroopId;
    }

    const profileId = request.params.scoutId ?? request.params.id;
    if (typeof profileId === 'string') {
      const profile = await this.prisma.scoutProfile.findUnique({
        where: { id: profileId },
        select: { troopId: true },
      });
      if (!profile) {
        throw new NotFoundException('Nie znaleziono profilu drużyny.');
      }
      return profile.troopId;
    }

    const scoutDegreeId = request.params.scoutDegreeId;
    if (typeof scoutDegreeId === 'string') {
      const degree = await this.prisma.scoutDegree.findUnique({
        where: { id: scoutDegreeId },
        select: { scout: { select: { troopId: true } } },
      });
      if (!degree) {
        throw new NotFoundException('Nie znaleziono próby.');
      }
      return degree.scout.troopId;
    }

    const taskId = request.params.taskId;
    if (typeof taskId === 'string') {
      const task = await this.prisma.scoutDegreeTask.findUnique({
        where: { id: taskId },
        select: {
          scoutDegree: { select: { scout: { select: { troopId: true } } } },
        },
      });
      if (!task) {
        throw new NotFoundException('Nie znaleziono zadania próby.');
      }
      return task.scoutDegree.scout.troopId;
    }

    throw new ForbiddenException('Nie można ustalić drużyny zasobu.');
  }

  assertMember(user: ApplicationUser, troopId: string): void {
    if (user.role === Role.ADMIN) {
      return;
    }

    if (!user.scoutProfile?.isActive || user.scoutProfile.troopId !== troopId) {
      throw new ForbiddenException('Brak dostępu do tej drużyny.');
    }
  }

  assertStaff(user: ApplicationUser, troopId: string): void {
    if (user.role === Role.ADMIN) {
      return;
    }

    this.assertMember(user, troopId);
    if (
      user.scoutProfile?.function !== Function.DRUZYNOWY &&
      user.scoutProfile?.function !== Function.PRZYBOCZNY
    ) {
      throw new ForbiddenException('Wymagana jest funkcja kadrowa.');
    }
  }

  assertLeader(user: ApplicationUser, troopId: string): void {
    this.assertMember(user, troopId);
    if (user.scoutProfile?.function !== Function.DRUZYNOWY) {
      throw new ForbiddenException('Wymagana jest funkcja drużynowego.');
    }
  }

  async assertCanAssignStaffFunction(
    authUser: AuthenticatedUser,
    troopId: string,
    targetFunction: Function,
  ): Promise<void> {
    if (
      targetFunction !== Function.DRUZYNOWY &&
      targetFunction !== Function.PRZYBOCZNY
    ) {
      return;
    }

    const user = await this.getApplicationUser(authUser);
    this.assertLeader(user, troopId);
  }
}
