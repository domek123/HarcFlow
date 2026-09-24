import { Pressable, Text, View } from "react-native";

import { router } from "expo-router";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { EventItem } from "@harcapp/types";
import { formatDate, formatTime } from "@harcapp/utils";

interface EventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        router.push(`/(main)/attendance/${event.id}`);
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel={t("common.edit")}
            onPress={() => onEdit(event)}
            style={styles.iconButton}
          >
            <Pencil size={17} color={theme.colors.primary} />
          </Pressable>
          <Pressable
            accessibilityLabel={t("common.delete")}
            onPress={() => onDelete(event)}
            style={styles.iconButton}
          >
            <Trash2 size={17} color={theme.colors.destructive} />
          </Pressable>
        </View>
      </View>
      <View style={styles.detailRow}>
        <CalendarDays size={16} color={theme.colors.primary} />
        <Text style={styles.detail}>{formatDate(event.startDate)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Clock3 size={16} color={theme.colors.primary} />
        <Text style={styles.detail}>
          {formatTime(event.startDate)} - {formatTime(event.endDate)}
        </Text>
      </View>
      {event.location ? (
        <View style={styles.detailRow}>
          <MapPin size={16} color={theme.colors.primary} />
          <Text style={styles.detail}>{event.location}</Text>
        </View>
      ) : null}
      {event.description ? (
        <Text style={styles.description}>{event.description}</Text>
      ) : null}
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 9,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    flex: 1,
    color: theme.colors.foreground,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22,
  },
  actions: { flexDirection: "row", gap: 6 },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detail: { flex: 1, color: theme.colors.mutedForeground, fontSize: 14 },
  description: {
    color: theme.colors.foreground,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },
}));
