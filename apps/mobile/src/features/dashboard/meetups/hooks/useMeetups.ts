import { useCallback, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useCurrentTroopId } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
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
  const [deleteItem, setDeleteItem] = useState<EventItem | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventDate, setNewEventDate] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useEvents(supabase, troopId, 10);

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

  const openDeleteModal = useCallback((event: EventItem) => {
    setDeleteItem(event);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteItem(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: EventFormValues) => {
      try {
        if (editingEvent) {
          const updatedCalendarEventId = await updateDeviceCalendarEvent(
            editingEvent.calendarEventId ?? undefined,
            values,
          );

          try {
            await updateEventMutation.mutateAsync({
              eventId: editingEvent.id,
              values: {
                ...values,
                calendarEventId: updatedCalendarEventId,
              },
            });

            showToast.success(t("dashboard.meetups.updateSuccess"));
            closeModal();
          } catch (supabaseError) {
            if (updatedCalendarEventId && !editingEvent.calendarEventId) {
              await deleteDeviceCalendarEvent(updatedCalendarEventId);
            }
            throw supabaseError;
          }
        } else {
          const calendarEventId = await createDeviceCalendarEvent(values);

          try {
            await createEventMutation.mutateAsync({
              ...values,
              calendarEventId,
            });

            showToast.success(t("dashboard.meetups.createSuccess"));
            closeModal();
          } catch (supabaseError) {
            if (calendarEventId) {
              await deleteDeviceCalendarEvent(calendarEventId);
            }
            throw supabaseError;
          }
        }
      } catch (error) {
        console.error("Błąd zapisywania wydarzenia:", error);
        showToast.error(
          editingEvent
            ? t("dashboard.meetups.updateError")
            : t("dashboard.meetups.createError"),
        );
      }
    },
    [editingEvent, updateEventMutation, createEventMutation, closeModal, t],
  );

  const handleDeleteEvent = useCallback(async () => {
    if (!deleteItem) return;

    try {
      if (deleteItem.calendarEventId) {
        await deleteDeviceCalendarEvent(deleteItem.calendarEventId);
      }

      await deleteEventMutation.mutateAsync(deleteItem.id);

      showToast.success(t("dashboard.meetups.deleteSuccess"));
      closeDeleteModal();
    } catch (error) {
      console.error("Błąd usuwania wydarzenia:", error);
      showToast.error(t("dashboard.meetups.deleteError"));
    }
  }, [deleteItem, deleteEventMutation, closeDeleteModal, t]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isRefetching) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isRefetching, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    if (isFetchingNextPage || isRefetching) {
      return;
    }

    refetch();
  }, [isFetchingNextPage, isRefetching, refetch]);

  return {
    events,
    visibleEvents,
    selectedDate,
    setSelectedDate,
    editingEvent,
    deleteItem,
    newEventDate,

    isLoading,
    isRefetching,
    isDeleting: deleteEventMutation.isPending,
    isSubmitting:
      createEventMutation.isPending || updateEventMutation.isPending,

    isModalVisible,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,

    handleSubmit,
    handleDeleteEvent,
    fetchNextPage: handleLoadMore,
    refetch: handleRefresh,
  };
}
