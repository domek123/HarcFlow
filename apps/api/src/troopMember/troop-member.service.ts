import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

import { TroopMemberSectionDTO } from '@harcapp/types';

@Injectable()
export class TroopMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(dto: CreateMemberDto) {
    try {
      return await this.prisma.scoutProfile.create({
        data: {
          rank: dto.rank,
          degree: dto.degree,
          function: dto.function,
          troops: {
            connect: { id: dto.troopId },
          },
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

    return this.prisma.scoutProfile.update({
      where: { id: profileId },
      data: {
        rank: dto.rank,
        degree: dto.degree,
        function: dto.function,
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
  ): Promise<TroopMemberSectionDTO[]> {
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
}
