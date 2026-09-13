import { Pressable, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { EventFormModal } from "./components/EventFormModal";
import { EventList } from "./components/EventList";
import { MeetupsCalendar } from "./components/MeetupsCalendar";
import { useMeetups } from "./hooks/useMeetups";

export function MeetupsScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const {
    closeModal,
    editingEvent,
    events,
    hasNextPage,
    handleDelete,
    handleSubmit,
    isLoading,
    isModalVisible,
    newEventDate,
    openCreateModal,
    openEditModal,
    refetch,
    selectedDate,
    setSelectedDate,
    visibleEvents,
    fetchNextPage,
  } = useMeetups();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.heading}>
            <Text style={styles.title}>{t("dashboard.meetups.title")}</Text>
            <Text style={styles.subtitle}>
              {t("dashboard.meetups.subtitle")}
            </Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={() => {
              openCreateModal();
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>
        <MeetupsCalendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onDateLongPress={(date) => {
            openCreateModal(date);
          }}
          onClearDate={() => setSelectedDate(null)}
        />
        <EventList
          events={visibleEvents}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          onLoadMore={() => void fetchNextPage()}
          onRefresh={() => void refetch()}
          onEdit={(event) => {
            openEditModal(event);
          }}
          onDelete={handleDelete}
        />
        <EventFormModal
          visible={isModalVisible}
          event={editingEvent}
          initialDate={newEventDate}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heading: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  addButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: 28,
    fontWeight: "400",
    lineHeight: 30,
  },
  list: {
    flex: 1,
  },
}));
