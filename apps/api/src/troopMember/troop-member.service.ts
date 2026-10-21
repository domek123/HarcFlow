import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Function, Degree } from '@prisma/client';

import { TroopMemberSectionDTO } from '@harcapp/types';

import { PrismaService } from '../../prisma/prisma.service';
import { degreeRank } from '../common/constants';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class TroopMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(dto: CreateMemberDto) {
    if (dto.patrolId) {
      const patrol = await this.prisma.scoutPatrol.findUnique({
        where: { id: dto.patrolId },
        select: { troopId: true },
      });
      if (!patrol || patrol.troopId !== dto.troopId) {
        throw new BadRequestException('Zastęp nie należy do wybranej drużyny.');
      }
    }

    try {
      return await this.prisma.scoutProfile.create({
        data: {
          rank: dto.rank,
          degree: dto.degree,
          function: dto.function,
          troops: {
            connect: { id: dto.troopId },
          },
          ...(dto.patrolId && {
            patrol: {
              connect: { id: dto.patrolId },
            },
          }),
          user: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              email: dto.email || null,
              phoneNumber: dto.phoneNumber || null,
              birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
              gender: dto.gender,
            },
          },
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Użytkownik o podanym adresie email już istnieje.',
          );
        }
      }
      console.error('Prisma Error:', error);
      throw new BadRequestException(
        'Wystąpił błąd podczas dodawania członka drużyny.',
      );
    }
  }

  async deleteMember(profileId: string) {
    const profile = await this.prisma.scoutProfile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });

    if (!profile) {
      throw new NotFoundException(
        'Nie znaleziono członka drużyny o podanym ID',
      );
    }

    await this.prisma.user.delete({
      where: { id: profile.userId },
    });

    return {
      message: 'Członek drużyny został pomyślnie usunięty',
      deletedId: profileId,
    };
  }

  async updateMember(profileId: string, dto: UpdateMemberDto) {
    const profile = await this.prisma.scoutProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Nie znaleziono profilu harcerskiego');
    }

    if (dto.patrolId) {
      const patrol = await this.prisma.scoutPatrol.findUnique({
        where: { id: dto.patrolId },
        select: { troopId: true },
      });
      if (!patrol || patrol.troopId !== profile.troopId) {
        throw new BadRequestException('Zastęp nie należy do drużyny członka.');
      }
    }

    const targetFunction = dto.function ?? profile.function;
    const isStaffFunction =
      targetFunction === Function.DRUZYNOWY ||
      targetFunction === Function.PRZYBOCZNY;

    let patrolUpdate:
      { disconnect: true } | { connect: { id: string } } | undefined =
      undefined;

    if (isStaffFunction) {
      patrolUpdate = { disconnect: true };
    } else if (dto.patrolId !== undefined) {
      patrolUpdate = dto.patrolId
        ? { connect: { id: dto.patrolId } }
        : { disconnect: true };
    }

    return this.prisma.scoutProfile.update({
      where: { id: profileId },
      data: {
        rank: dto.rank,
        degree: dto.degree,
        function: dto.function,
        patrol: patrolUpdate,
        user: {
          update: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email !== undefined ? dto.email || null : undefined,
            phoneNumber:
              dto.phoneNumber !== undefined
                ? dto.phoneNumber || null
                : undefined,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            gender: dto.gender,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async getTroopMembersSection(
    troopId: string,
  ): Promise<Omit<TroopMemberSectionDTO, 'acquiringDegree'>[]> {
    const members = await this.prisma.scoutProfile.findMany({
      where: {
        troopId: troopId,
      },
      select: {
        id: true,
        rank: true,
        degree: true,
        function: true,
        patrolId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            birthDate: true,
          },
        },
        patrol: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ function: 'asc' }, { degree: 'desc' }],
    });

    return members.map((member) => ({
      id: member.id,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      birthDate: member.user.birthDate,
      rank: member.rank,
      degree: member.degree,
      function: member.function,
      patrolId: member.patrolId,
    }));
  }

  async updateDegree(
    profileId: string,
    degree: Degree,
    acquiringDegree: Degree,
  ) {
    const degreeIndex = degreeRank[degree];
    const acquiringDegreeIndex = degreeRank[acquiringDegree];

    if (degreeIndex === -1 || acquiringDegreeIndex === -1) {
      throw new BadRequestException('Nieprawidłowy stopień harcerski');
    }

    if (acquiringDegreeIndex < degreeIndex) {
      throw new BadRequestException(
        'Stopień zdobywany nie może być nizszy niż aktualny stopień harcerski',
      );
    }

    return this.prisma.scoutProfile.update({
      where: { id: profileId },
      data: { degree, acquiringDegree },
    });
  }
}
