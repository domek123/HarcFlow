import { ActivityIndicator, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { EventItem } from "@harcapp/types";

import { EventCard } from "./EventCard";

interface EventListProps {
  events: EventItem[];
  isLoading: boolean;
  isRefetching: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

export function EventList({
  events,
  isLoading,
  isRefetching,
  onLoadMore,
  onRefresh,
  onEdit,
  onDelete,
}: EventListProps) {
  const { styles } = useStyles(stylesheet);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <FlashList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard event={item} onEdit={onEdit} onDelete={onDelete} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.content}
      onRefresh={onRefresh}
      refreshing={isRefetching}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.4}
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
