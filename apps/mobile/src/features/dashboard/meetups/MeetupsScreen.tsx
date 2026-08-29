import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function MeetupsScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("dashboard.meetups.title")}</Text>
        <Text style={styles.subtitle}>{t("dashboard.meetups.subtitle")}</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
    textAlign: "center",
  },
}));
