import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Degree, Function, Rank } from '@prisma/client';

import { TroopMemberService } from './troop-member.service';

describe('TroopMemberService', () => {
  function createService() {
    const prisma = {
      scoutPatrol: { findUnique: jest.fn() },
      scoutProfile: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      user: { delete: jest.fn() },
    };
    return { prisma, service: new TroopMemberService(prisma as never) };
  }

  it('creates a member after validating the patrol troop', async () => {
    const { prisma, service } = createService();
    prisma.scoutPatrol.findUnique.mockResolvedValue({ troopId: 'troop-1' });
    prisma.scoutProfile.create.mockResolvedValue({ id: 'profile-1' });
    const dto = {
      troopId: 'troop-1',
      patrolId: 'patrol-1',
      rank: Rank.NONE,
      degree: Degree.NONE,
      function: Function.NONE,
      firstName: 'Jan',
      lastName: 'Kowalski',
      gender: 'MALE',
    } as never;

    await expect(service.createMember(dto)).resolves.toEqual({ id: 'profile-1' });
    expect(prisma.scoutProfile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          troops: { connect: { id: 'troop-1' } },
          patrol: { connect: { id: 'patrol-1' } },
        }),
      }),
    );
  });

  it('rejects a patrol from another troop', async () => {
    const { prisma, service } = createService();
    prisma.scoutPatrol.findUnique.mockResolvedValue({ troopId: 'troop-2' });

    await expect(
      service.createMember({ troopId: 'troop-1', patrolId: 'patrol-1' } as never),
    ).rejects.toThrow(new BadRequestException('Zastęp nie należy do wybranej drużyny.'));
  });

  it('deletes the linked user and returns the profile id', async () => {
    const { prisma, service } = createService();
    prisma.scoutProfile.findUnique.mockResolvedValue({ userId: 'user-1' });

    await expect(service.deleteMember('profile-1')).resolves.toEqual({
      message: 'Członek drużyny został pomyślnie usunięty',
      deletedId: 'profile-1',
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-1' } });
  });

  it('rejects deleting a missing member', async () => {
    const { prisma, service } = createService();
    prisma.scoutProfile.findUnique.mockResolvedValue(null);

    await expect(service.deleteMember('missing')).rejects.toThrow(
      new NotFoundException('Nie znaleziono członka drużyny o podanym ID'),
    );
  });

  it('updates a member and disconnects patrol for staff', async () => {
    const { prisma, service } = createService();
    prisma.scoutProfile.findUnique.mockResolvedValue({
      troopId: 'troop-1',
      function: Function.NONE,
    });
    prisma.scoutProfile.update.mockResolvedValue({ id: 'profile-1' });

    await service.updateMember('profile-1', {
      function: Function.DRUZYNOWY,
    } as never);

    expect(prisma.scoutProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'profile-1' },
        data: expect.objectContaining({ patrol: { disconnect: true } }),
      }),
    );
  });

  it('maps troop members to the section DTO', async () => {
    const { prisma, service } = createService();
    const birthDate = new Date('2010-01-01');
    prisma.scoutProfile.findMany.mockResolvedValue([
      {
        id: 'profile-1',
        rank: Rank.NONE,
        degree: Degree.DH,
        function: Function.NONE,
        patrolId: 'patrol-1',
        user: { firstName: 'Jan', lastName: 'Kowalski', birthDate },
        patrol: { id: 'patrol-1' },
      },
    ]);

    await expect(service.getTroopMembersSection('troop-1')).resolves.toEqual([
      {
        id: 'profile-1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        birthDate,
        rank: Rank.NONE,
        degree: Degree.DH,
        function: Function.NONE,
        patrolId: 'patrol-1',
      },
    ]);
  });

  it('updates a valid degree progression and rejects a downgrade', async () => {
    const { prisma, service } = createService();
    prisma.scoutProfile.update.mockResolvedValue({ id: 'profile-1' });

    await expect(
      service.updateDegree('profile-1', Degree.DH, Degree.ML),
    ).resolves.toEqual({ id: 'profile-1' });
    await expect(
      service.updateDegree('profile-1', Degree.ML, Degree.DH),
    ).rejects.toThrow(
      new BadRequestException(
        'Stopień zdobywany nie może być nizszy niż aktualny stopień harcerski',
      ),
    );
  });
});
