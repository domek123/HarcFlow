import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { ScoutProfileDTO } from "@harcapp/types";

import { DetailRow } from "./SharedUI";

export function MemberContactSection({ member }: { member: ScoutProfileDTO }) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t("dashboard.memberDetails.contact")}
      </Text>
      {member && (
        <>
          <DetailRow
            label={t("dashboard.memberDetails.phone")}
            value={member.phoneNumber}
          />
          <DetailRow
            label={t("dashboard.memberDetails.email")}
            value={member.email}
          />
        </>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "800",
  },
}));
