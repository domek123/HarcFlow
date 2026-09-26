import { CreateEventInput, EventItem } from "@harcapp/types";
import { EventFormValues } from "@harcapp/validators";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchEventsPage(
  supabase: SupabaseClient,
  troopId: string,
  page: number = 0,
  pageSize: number = 10,
  currentYear: string,
): Promise<{ items: EventItem[]; hasNextPage: boolean }> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("Event")
    .select("*", { count: "exact" })
    .eq("troopId", troopId)
    .eq("currentYear", currentYear)
    .order("startDate", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error(error.message);
  }

  const items: EventItem[] = (data || []).map((row) => ({
    id: row.id,
    troopId: row.troopId,
    patrolId: row.patrolId,
    title: row.title,
    description: row.description,
    location: row.location,
    startDate: row.startDate,
    endDate: row.endDate,
    createdAt: row.createdAt,
    calendarEventId: row.calendarEventId,
  }));

  return {
    items,
    hasNextPage: count ? to < count - 1 : false,
  };
}

// 2. CREATE
export async function createEvent(
  supabase: SupabaseClient,
  troopId: string,
  values: CreateEventInput,
): Promise<EventItem> {
  const { data, error } = await supabase
    .from("Event")
    .insert({
      troopId,
      title: values.title.trim(),
      description: values.description?.trim() || null,
      location: values.location?.trim() || null,
      startDate: values.startDate,
      endDate: values.endDate,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    troopId: data.troopId,
    title: data.title,
    description: data.description,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    createdAt: data.createdAt,
  };
}

// 3. UPDATE
export async function updateEvent(
  supabase: SupabaseClient,
  eventId: string,
  values: CreateEventInput,
): Promise<EventItem> {
  const { data, error } = await supabase
    .from("Event")
    .update({
      title: values.title.trim(),
      description: values.description?.trim() || null,
      location: values.location?.trim() || null,
      startDate: values.startDate,
      endDate: values.endDate,
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    troopId: data.troopId,
    title: data.title,
    description: data.description,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    createdAt: data.createdAt,
  };
}

// 4. DELETE
export async function deleteEvent(
  supabase: SupabaseClient,
  eventId: string,
): Promise<void> {
  const { error } = await supabase.from("Event").delete().eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    throw new Error(error.message);
  }
}
