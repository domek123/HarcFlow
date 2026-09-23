import { Pressable, Text, View } from "react-native";

import { createStyleSheet, useStyles } from "react-native-unistyles";

import { AttendanceStatus, TroopMemberAttendanceDTO } from "@harcapp/types";

import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

interface AttendanceMemberRowProps {
  member: TroopMemberAttendanceDTO;
  status: AttendanceStatus | null;
  isEditing: boolean;
  getStatusLabel: (status: AttendanceStatus) => string;
  onStatusChange: (status: AttendanceStatus) => void;
}

const statuses = [
  AttendanceStatus.PRESENT,
  AttendanceStatus.EXCUSED,
  AttendanceStatus.ABSENT,
] as const;

export function AttendanceMemberRow({
  member,
  status,
  isEditing,
  getStatusLabel,
  onStatusChange,
}: AttendanceMemberRowProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.row}>
      <View style={styles.identityRow}>
        <Text style={styles.name}>
          {member.firstName} {member.lastName}
        </Text>
        {!isEditing && status && (
          <AttendanceStatusBadge
            status={status}
            label={getStatusLabel(status)}
          />
        )}
      </View>
      {isEditing && (
        <View style={styles.options}>
          {statuses.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityLabel={getStatusLabel(option)}
              accessibilityState={{ selected: status === option }}
              onPress={() => onStatusChange(option)}
              style={[
                styles.option,
                status === option && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  status === option && styles.selectedOptionText,
                ]}
              >
                {getStatusLabel(option)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  row: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  identityRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  name: {
    color: theme.colors.foreground,
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  options: { flexDirection: "row", gap: 5, width: "100%" },
  option: {
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.foreground,
    fontSize: 10,
    textAlign: "center",
  },
  selectedOptionText: {
    color: theme.colors.primaryForeground,
    fontWeight: "700",
  },
}));
