import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import { useTranslation } from "react-i18next";

import { useCurrentTroopId } from "@/hooks";
import { supabase } from "@/lib/supabase";
import {
  useCreateEvent,
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
} from "@harcapp/api-client";
import { EventItem } from "@harcapp/types";
import { EventFormValues } from "@harcapp/validators";

import {
  createDeviceCalendarEvent,
  deleteDeviceCalendarEvent,
  updateDeviceCalendarEvent,
} from "../calendarService";
import { getEventDateKey } from "../utils/getEventDateKey";

export function useMeetups() {
  const { t } = useTranslation();
  const { troopId } = useCurrentTroopId();

  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventDate, setNewEventDate] = useState<string | null>(null);
  const [calendarEventIds, setCalendarEventIds] = useState<
    Record<string, string>
  >({});

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useEvents(supabase, troopId, 3);

  const createEventMutation = useCreateEvent(supabase, troopId);
  const updateEventMutation = useUpdateEvent(supabase, troopId);
  const deleteEventMutation = useDeleteEvent(supabase, troopId);

  const events = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const visibleEvents = useMemo(
    () =>
      selectedDate
        ? events.filter(
            (event) => getEventDateKey(event.startDate) === selectedDate,
          )
        : events,
    [events, selectedDate],
  );

  const openCreateModal = useCallback((date?: string) => {
    setEditingEvent(null);
    setNewEventDate(date ?? null);
    if (date) setSelectedDate(date);
    setIsModalVisible(true);
  }, []);

  const openEditModal = useCallback((event: EventItem) => {
    setEditingEvent(event);
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingEvent(null);
    setNewEventDate(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: EventFormValues) => {
      try {
        if (editingEvent) {
          await updateEventMutation.mutateAsync({
            eventId: editingEvent.id,
            values,
          });

          const calendarId = calendarEventIds[editingEvent.id];
          if (calendarId) await updateDeviceCalendarEvent(calendarId, values);
        } else {
          const newEvent = await createEventMutation.mutateAsync(values);
          const calendarId = await createDeviceCalendarEvent(values);
          if (calendarId) {
            setCalendarEventIds((prev) => ({
              ...prev,
              [newEvent.id]: calendarId,
            }));
          }
        }

        closeModal();
      } catch {
        Alert.alert(t("dashboard.meetups.errors.calendar"));
      }
    },
    [
      calendarEventIds,
      closeModal,
      createEventMutation,
      editingEvent,
      t,
      updateEventMutation,
    ],
  );

  const handleDelete = useCallback(
    (event: EventItem) => {
      Alert.alert(
        t("dashboard.meetups.deleteTitle"),
        t("dashboard.meetups.deleteMessage", { title: event.title }),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.delete"),
            style: "destructive",
            onPress: () => {
              void (async () => {
                try {
                  await deleteEventMutation.mutateAsync(event.id);

                  const calendarId = calendarEventIds[event.id];
                  if (calendarId) await deleteDeviceCalendarEvent(calendarId);
                } catch {
                  Alert.alert(t("dashboard.meetups.errors.calendar"));
                }
              })();
            },
          },
        ],
      );
    },
    [calendarEventIds, deleteEventMutation, t],
  );

  return {
    closeModal,
    editingEvent,
    events,
    hasNextPage,
    handleDelete,
    handleSubmit,
    isLoading: isLoading || isFetchingNextPage,
    isModalVisible,
    newEventDate,
    openCreateModal,
    openEditModal,
    refetch,
    selectedDate,
    setSelectedDate,
    visibleEvents,
    fetchNextPage,
  };
}
