import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ChevronDown, ChevronUp, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Calendar, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { EventItem } from "@harcapp/types";

import { getEventDateKey } from "../../utils/getEventDateKey";

interface MeetupsCalendarProps {
  events: EventItem[];
  selectedDate: string | null;
  onDateChange: (date: string) => void;
  onDateLongPress: (date: string) => void;
  onAddEvent: () => void;
  onClearDate: () => void;
}

export function MeetupsCalendar({
  events,
  selectedDate,
  onAddEvent,
  onDateChange,
  onDateLongPress,
  onClearDate,
}: MeetupsCalendarProps) {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);
  const [isExpanded, setIsExpanded] = useState(true);

  const markedDates = useMemo<MarkedDates>(() => {
    const marks: MarkedDates = {};

    events.forEach((event) => {
      const dateKey = getEventDateKey(event.startDate);
      marks[dateKey] = {
        marked: true,
        dotColor: theme.colors.primary,
        selected: dateKey === selectedDate,
        selectedColor: theme.colors.primary,
      };
    });

    if (selectedDate && !marks[selectedDate]) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primary,
      };
    }

    return marks;
  }, [events, selectedDate, theme.colors.primary]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, !isExpanded && styles.collapsedHeader]}>
        <Pressable
          accessibilityLabel={
            isExpanded
              ? t("dashboard.meetups.collapseCalendar")
              : t("dashboard.meetups.expandCalendar")
          }
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          onPress={() => setIsExpanded((current) => !current)}
          style={styles.toggle}
        >
          <Text style={styles.title}>
            {t("dashboard.meetups.calendarTitle")}
          </Text>
          {isExpanded ? (
            <ChevronUp size={18} color={theme.colors.foreground} />
          ) : (
            <ChevronDown size={18} color={theme.colors.foreground} />
          )}
        </Pressable>
        {selectedDate ? (
          <Pressable
            onPress={onClearDate}
            accessibilityLabel={t("dashboard.meetups.showAll")}
            accessibilityRole="button"
            style={styles.clearButton}
          >
            <Text style={styles.clear}>{t("dashboard.meetups.showAll")}</Text>
          </Pressable>
        ) : null}
      </View>
      {isExpanded ? (
        <>
          <Calendar
            firstDay={1}
            enableSwipeMonths
            hideExtraDays
            markedDates={markedDates}
            onDayPress={(day: DateData) => onDateChange(day.dateString)}
            onDayLongPress={(day: DateData) => onDateLongPress(day.dateString)}
            theme={{
              backgroundColor: theme.colors.card,
              calendarBackground: theme.colors.card,
              dayTextColor: theme.colors.foreground,
              textDisabledColor: theme.colors.mutedForeground,
              monthTextColor: theme.colors.foreground,
              textMonthFontWeight: "800",
              textDayFontWeight: "600",
              arrowColor: theme.colors.primary,
              todayTextColor: theme.colors.primary,
            }}
          />
          {selectedDate ? (
            <Text style={styles.filterInfo}>
              {t("dashboard.meetups.selectedDate", { date: selectedDate })}
            </Text>
          ) : (
            <Text style={styles.hint}>
              {t("dashboard.meetups.longPressHint")}
            </Text>
          )}
        </>
      ) : null}
      <Pressable
        accessibilityLabel={t("dashboard.meetups.addTitle")}
        accessibilityRole="button"
        onPress={() => onAddEvent()}
        style={styles.addButton}
      >
        <Plus
          size={18}
          color={theme.colors.primaryForeground}
          strokeWidth={2.5}
        />
        <Text style={styles.addButtonText}>
          {t("dashboard.meetups.addTitle")}
        </Text>
      </Pressable>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  collapsedHeader: {
    backgroundColor: theme.colors.background,
  },
  toggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 24,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 15,
    fontWeight: "800",
  },
  clear: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  clearButton: {
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  filterInfo: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  hint: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: 14,
    fontWeight: "700",
  },
}));
