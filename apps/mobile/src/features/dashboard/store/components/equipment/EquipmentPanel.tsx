import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function EquipmentPanel() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>
        {t("dashboard.inventory.equipmentTitle")}
      </Text>
      <Text style={styles.panelText}>
        {t("dashboard.inventory.equipmentDescription")}
      </Text>
      <View style={styles.listCard}>
        <Text style={styles.listItem}>
          • {t("dashboard.inventory.equipmentList.0")}
        </Text>
        <Text style={styles.listItem}>
          • {t("dashboard.inventory.equipmentList.1")}
        </Text>
        <Text style={styles.listItem}>
          • {t("dashboard.inventory.equipmentList.2")}
        </Text>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  panel: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  panelTitle: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "700",
  },
  panelText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  listCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  listItem: {
    color: theme.colors.foreground,
    fontSize: 14,
  },
}));
