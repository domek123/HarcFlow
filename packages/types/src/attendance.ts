import { AttendanceStatus } from "@prisma/client";
export { AttendanceStatus };

export interface CreateAttendanceInput {
  eventId: string;
  scoutId: string;
  status: AttendanceStatus;
}
