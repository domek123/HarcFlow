import { ActivityIndicator, Text, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { EventItem } from "@harcapp/types";

import { EventCard } from "./EventCard";

interface EventListProps {
  events: EventItem[];
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onPress: (event: EventItem) => void;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

export function EventList({
  events,
  isLoading,
  hasNextPage,
  onLoadMore,
  onRefresh,
  onPress,
  onEdit,
  onDelete,
}: EventListProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  return (
    <FlashList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={onPress}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.content}
      onRefresh={onRefresh}
      refreshing={isLoading && events.length > 0}
      onEndReached={() => {
        if (hasNextPage && !isLoading) onLoadMore();
      }}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.empty}>{t("dashboard.meetups.empty")}</Text>
        )
      }
      ListFooterComponent={
        isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : hasNextPage ? (
          <Text style={styles.more}>{t("dashboard.meetups.loadMore")}</Text>
        ) : null
      }
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  content: { paddingBottom: 100 },
  separator: { height: 10 },
  empty: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    padding: 24,
  },
  loader: { margin: 16 },
  more: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    padding: 12,
  },
}));
