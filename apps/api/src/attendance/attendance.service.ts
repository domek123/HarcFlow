import { Injectable } from '@nestjs/common';
import { AttendanceStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { Function } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAttendanceStatistics(troopId: string) {
    const [events, scouts] = await Promise.all([
      this.prisma.event.findMany({
        where: {
          troopId,
          startDate: {
            lte: new Date(),
          },
        },
        select: {
          id: true,
        },
      }),

      this.prisma.scoutProfile.findMany({
        where: {
          troopId,
        },
        select: {
          id: true,
          patrolId: true,
          function: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },

          patrol: {
            select: {
              id: true,
              name: true,
            },
          },

          attendances: {
            where: {
              event: {
                startDate: {
                  lte: new Date(),
                },
              },
            },
            select: {
              eventId: true,
              status: true,
            },
          },
        },
      }),
    ]);

    const calculateRate = (
      present: number,
      absent: number,
      excused: number,
    ): number | null => {
      const recorded = present + absent + excused;

      return recorded > 0 ? present / recorded : null;
    };

    const troop = {
      totalEvents: events.length,
      present: 0,
      absent: 0,
      excused: 0,
      attendanceRate: null as number | null,
    };

    type PatrolStatistics = {
      id: string;
      name: string;
      present: number;
      absent: number;
      excused: number;
      attendanceRate: number | null;
      members: {
        id: string;
        firstName: string;
        lastName: string;
        present: number;
        absent: number;
        excused: number;
        attendanceRate: number | null;
      }[];
    };

    const patrolMap = new Map<string, PatrolStatistics>();

    for (const scout of scouts) {
      const attendanceByEvent = new Map(
        scout.attendances.map((attendance) => [
          attendance.eventId,
          attendance.status,
        ]),
      );

      let present = 0;
      let absent = 0;
      let excused = 0;
      let notRecorded = 0;

      for (const event of events) {
        const status = attendanceByEvent.get(event.id);

        switch (status) {
          case AttendanceStatus.PRESENT:
            present++;
            break;

          case AttendanceStatus.ABSENT:
            absent++;
            break;

          case AttendanceStatus.EXCUSED:
            excused++;
            break;
        }
      }

      troop.present += present;
      troop.absent += absent;
      troop.excused += excused;

      const isCadre =
        scout.function === Function.DRUZYNOWY ||
        scout.function === Function.PRZYBOCZNY;

      const patrolId = isCadre ? 'kadra' : (scout.patrol?.id ?? 'unassigned');

      const patrolName = isCadre
        ? 'Kadra'
        : (scout.patrol?.name ?? 'Bez zastępu');

      let patrol = patrolMap.get(patrolId);

      if (!patrol) {
        patrol = {
          id: patrolId,
          name: patrolName,
          present: 0,
          absent: 0,
          excused: 0,
          attendanceRate: null,
          members: [],
        };

        patrolMap.set(patrolId, patrol);
      }

      patrol.present += present;
      patrol.absent += absent;
      patrol.excused += excused;

      patrol.members.push({
        id: scout.id,
        firstName: scout.user.firstName,
        lastName: scout.user.lastName,
        present,
        absent,
        excused,
        attendanceRate: calculateRate(present, absent, excused),
      });
    }

    troop.attendanceRate = calculateRate(
      troop.present,
      troop.absent,
      troop.excused,
    );

    const patrols = Array.from(patrolMap.values()).map((patrol) => ({
      id: patrol.id,
      name: patrol.name,
      members: patrol.members,
      attendanceRate: calculateRate(
        patrol.present,
        patrol.absent,
        patrol.excused,
      ),
    }));

    return {
      troop: {
        totalEvents: troop.totalEvents,
        attendanceRate: troop.attendanceRate,
      },
      patrols,
    };
  }
}
