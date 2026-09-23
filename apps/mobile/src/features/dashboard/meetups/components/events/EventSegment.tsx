import { useTranslation } from "react-i18next";

import { DeleteModal } from "@/components";

import { useMeetups } from "../../hooks/useMeetups";
import { EventFormModal } from "./EventFormModal";
import { EventList } from "./EventList";
import { MeetupsCalendar } from "./MeetupsCalendar";

export function EventSegment() {
  const { t } = useTranslation();

  const {
    events,
    visibleEvents,
    selectedDate,
    editingEvent,
    newEventDate,
    deleteItem,

    isLoading,
    isRefetching,
    isDeleting,
    isSubmitting,

    isModalVisible,
    setSelectedDate,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,

    handleSubmit,
    handleDeleteEvent,
    fetchNextPage,
    refetch,
  } = useMeetups();

  return (
    <>
      <MeetupsCalendar
        events={events}
        selectedDate={selectedDate}
        onAddEvent={openCreateModal}
        onDateChange={setSelectedDate}
        onDateLongPress={(date) => {
          openCreateModal(date);
        }}
        onClearDate={() => setSelectedDate(null)}
      />
      <EventList
        events={visibleEvents}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onLoadMore={fetchNextPage}
        onRefresh={refetch}
        onEdit={(event) => {
          openEditModal(event);
        }}
        onDelete={openDeleteModal}
      />
      <EventFormModal
        visible={isModalVisible}
        event={editingEvent}
        isSubmitting={isSubmitting}
        initialDate={newEventDate}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
      {deleteItem && (
        <DeleteModal
          titleMessage={t("dashboard.meetups.deleteTitle")}
          contentMessage={
            deleteItem
              ? t("dashboard.meetups.deleteMessage", {
                  title: deleteItem.title,
                })
              : null
          }
          isOpen={deleteItem !== null}
          isPending={isDeleting}
          onCancel={closeDeleteModal}
          onConfirm={handleDeleteEvent}
        />
      )}
    </>
  );
}
