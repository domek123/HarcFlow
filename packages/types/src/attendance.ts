import { AttendanceStatus } from "@prisma/client";
export { AttendanceStatus };

export interface CreateAttendanceInput {
  eventId: string;
  scoutId: string;
  status: AttendanceStatus;
}

export type AttendanceStatistics = {
  troop: {
    totalEvents: number;
    attendanceRate: number | null;
  };

  patrols: {
    id: string;
    name: string;
    attendanceRate: number | null;
    members: {
      id: string;
      firstName: string;
      lastName: string;
      patrolId: string | null;
      present: number;
      absent: number;
      excused: number;
      attendanceRate: number | null;
    }[];
  }[];
};
