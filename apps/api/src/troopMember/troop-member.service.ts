import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class TroopMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(dto: CreateMemberDto) {
    try {
      const newScoutProfile = await this.prisma.scoutProfile.create({
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
        select: {
          id: true,
          userId: true,
        },
      });

      return {
        message: 'Członek został pomyślnie dodany',
        memberId: newScoutProfile.id,
      };
    } catch (error) {
      console.error('Prisma Error:', error);
      throw new BadRequestException(`Błąd dodawania członka: ${error.message}`);
    }
  }

  async deleteMember(profileId: string) {
    const profile = await this.prisma.scoutProfile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });

    if (!profile) {
      throw new NotFoundException('Nie znaleziono członka drużyny o podanym ID');
    }

    await this.prisma.user.delete({
      where: { id: profile.userId },
    });

    return {
      message: 'Członek drużyny i jego konto zostały pomyślnie usunięte',
      deletedId: profileId,
    };
  }
}