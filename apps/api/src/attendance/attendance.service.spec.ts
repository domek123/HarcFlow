import { AttendanceStatus, Function } from '@prisma/client';

import { AttendanceService } from './attendance.service';

describe('AttendanceService', () => {
  it('calculates troop and patrol attendance statistics', async () => {
    const prisma = {
      event: { findMany: jest.fn().mockResolvedValue([{ id: 'event-1' }]) },
      scoutProfile: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'scout-1',
            patrolId: 'patrol-1',
            function: Function.NONE,
            user: { firstName: 'Jan', lastName: 'Kowalski' },
            patrol: { id: 'patrol-1', name: 'Wilki' },
            attendances: [{ eventId: 'event-1', status: AttendanceStatus.PRESENT }],
          },
          {
            id: 'scout-2',
            patrolId: null,
            function: Function.DRUZYNOWY,
            user: { firstName: 'Anna', lastName: 'Nowak' },
            patrol: null,
            attendances: [{ eventId: 'event-1', status: AttendanceStatus.EXCUSED }],
          },
        ]),
      },
    };

    await expect(
      new AttendanceService(prisma as never).getAttendanceStatistics('troop-1'),
    ).resolves.toEqual({
      troop: { totalEvents: 1, attendanceRate: 0.5 },
      patrols: [
        {
          id: 'patrol-1',
          name: 'Wilki',
          attendanceRate: 1,
          members: [
            {
              id: 'scout-1',
              firstName: 'Jan',
              lastName: 'Kowalski',
              present: 1,
              absent: 0,
              excused: 0,
              attendanceRate: 1,
            },
          ],
        },
        {
          id: 'kadra',
          name: 'Kadra',
          attendanceRate: 0,
          members: [
            {
              id: 'scout-2',
              firstName: 'Anna',
              lastName: 'Nowak',
              present: 0,
              absent: 0,
              excused: 1,
              attendanceRate: 0,
            },
          ],
        },
      ],
    });

    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ troopId: 'troop-1' }) }),
    );
    expect(prisma.scoutProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { troopId: 'troop-1' } }),
    );
  });

  it('returns null rates when there are no recorded attendances', async () => {
    const prisma = {
      event: { findMany: jest.fn().mockResolvedValue([]) },
      scoutProfile: { findMany: jest.fn().mockResolvedValue([]) },
    };

    await expect(
      new AttendanceService(prisma as never).getAttendanceStatistics('troop-1'),
    ).resolves.toEqual({
      troop: { totalEvents: 0, attendanceRate: null },
      patrols: [],
    });
  });
});
