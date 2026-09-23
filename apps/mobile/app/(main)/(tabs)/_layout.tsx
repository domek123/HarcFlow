import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: styles.activeTint.color,
        tabBarInactiveTintColor: styles.inactiveTint.color,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("dashboard.navigation.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: t("dashboard.navigation.team"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meetups"
        options={{
          title: t("dashboard.navigation.meetups"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: t("dashboard.navigation.inventory"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("dashboard.navigation.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  activeTint: {
    color: theme.colors.primary,
  },
  inactiveTint: {
    color: theme.colors.mutedForeground,
  },
  tabBar: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 72,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
}));
