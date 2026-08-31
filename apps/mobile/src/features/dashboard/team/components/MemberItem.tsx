import { Pressable, View, Text } from "react-native";

import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { TroopMemberSectionDTO } from "@harcapp/types";

import { getAgeFromBirthDate } from "../utils/getAgeFromBirthDate";

type MemberItemProps = {
  member: TroopMemberSectionDTO;
};

export const MemberItem = ({ member }: MemberItemProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      key={member.id}
      style={styles.memberCard}
      onPress={() => router.push(`/member/${member.id}`)}
    >
      <View style={styles.memberRow}>
        <View style={styles.memberContent}>
          <View style={styles.memberHeaderRow}>
            <Text style={styles.memberName}>
              {member.firstName} {member.lastName}
            </Text>
            <Text style={styles.memberAge}>
              {getAgeFromBirthDate(member.birthDate)}
            </Text>
          </View>

          <Text style={styles.memberMeta}>
            {t(`enums.function.${member.function}`)}
          </Text>

          <Text style={styles.memberMetaSecondary}>
            {t(`enums.degree.${member.degree}`)}
            {member.rank !== "NONE" && ` · ${t(`enums.rank.${member.rank}`)}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  memberCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    padding: 12,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memberContent: {
    flex: 1,
    gap: 2,
  },
  memberHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  memberName: {
    color: theme.colors.foreground,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  memberAge: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    fontWeight: "600",
  },
  memberMeta: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  memberMetaSecondary: {
    color: theme.colors.mutedForeground,
    fontSize: 11,
  },
}));
