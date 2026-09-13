import * as Calendar from "expo-calendar/legacy";

import { EventFormValues } from "@harcapp/validators";

async function getWritableCalendar() {
  const permission = await Calendar.requestCalendarPermissionsAsync();

  if (permission.status !== "granted") {
    return null;
  }

  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );

  return calendars.find((calendar) => calendar.allowsModifications) ?? null;
}

function toCalendarEvent(values: EventFormValues) {
  return {
    title: values.title,
    notes: values.description || undefined,
    startDate: new Date(values.startDate),
    endDate: new Date(values.endDate),
    location: values.location || undefined,
  };
}

export async function createDeviceCalendarEvent(
  values: EventFormValues,
): Promise<string | null> {
  if (!values.saveToDeviceCalendar) {
    return null;
  }

  const calendar = await getWritableCalendar();
  if (!calendar) {
    return null;
  }

  const eventId = await Calendar.createEventAsync(
    calendar.id,
    toCalendarEvent(values),
  );

  return eventId;
}

export async function updateDeviceCalendarEvent(
  calendarEventId: string | undefined,
  values: EventFormValues,
): Promise<string | null> {
  if (!values.saveToDeviceCalendar) {
    if (calendarEventId) {
      await Calendar.deleteEventAsync(calendarEventId);
    }

    return null;
  }

  if (calendarEventId) {
    await Calendar.updateEventAsync(calendarEventId, toCalendarEvent(values));

    return calendarEventId;
  }

  return createDeviceCalendarEvent(values);
}

export async function deleteDeviceCalendarEvent(
  calendarEventId: string | undefined,
): Promise<void> {
  if (!calendarEventId) {
    return;
  }

  await Calendar.deleteEventAsync(calendarEventId);
}
