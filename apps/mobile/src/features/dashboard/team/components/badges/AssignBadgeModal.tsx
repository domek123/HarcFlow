import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { BadgePickerModal } from "@/components";
import { Badge } from "@harcapp/types";

interface AssignBadgeModalProps {
  visible: boolean;
  memberName: string;
  ownedBadgeIds: string[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (badgeId: string) => void;
}

export function AssignBadgeModal({
  visible,
  memberName,
  ownedBadgeIds,
  isPending,
  onClose,
  onSubmit,
}: AssignBadgeModalProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const [selectedBadge, setSelectedBadge] = useState<Badge>();
  const [pickerVisible, setPickerVisible] = useState(false);

  const close = () => {
    setSelectedBadge(undefined);
    onClose();
  };

  const submit = () => {
    if (!selectedBadge) return;
    onSubmit(selectedBadge.id);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={close}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                {t("dashboard.team.badges.assign")}
              </Text>
              <Text style={styles.subtitle}>{memberName}</Text>
            </View>
            <Pressable
              accessibilityLabel={t("common.close")}
              onPress={close}
              style={styles.closeButton}
            >
              <X size={22} color={styles.title.color} />
            </Pressable>
          </View>

          <Text style={styles.label}>{t("dashboard.team.badges.choose")}</Text>
          <Pressable
            onPress={() => setPickerVisible(true)}
            style={styles.selectButton}
          >
            <Text style={styles.selectText}>
              {selectedBadge?.name ?? t("dashboard.team.badges.choose")}
            </Text>
          </Pressable>

          <Pressable
            disabled={!selectedBadge || isPending}
            onPress={submit}
            style={[
              styles.submitButton,
              (!selectedBadge || isPending) && styles.disabled,
            ]}
          >
            <Text style={styles.submitText}>
              {isPending
                ? t("common.saving")
                : t("dashboard.team.badges.assign")}
            </Text>
          </Pressable>
        </View>
      </View>
      <BadgePickerModal
        visible={pickerVisible}
        selectedBadgeId={selectedBadge?.id}
        excludedBadgeIds={ownedBadgeIds}
        onClose={() => setPickerVisible(false)}
        onSelect={setSelectedBadge}
      />
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  dialog: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: { flex: 1, gap: 4 },
  title: { color: theme.colors.foreground, fontSize: 22, fontWeight: "800" },
  subtitle: { color: theme.colors.mutedForeground, fontSize: 14 },
  closeButton: { padding: 6 },
  label: {
    color: theme.colors.foreground,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 14,
  },
  selectText: { color: theme.colors.foreground },
  statusPicker: { flexDirection: "row", gap: 6 },
  statusOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  statusOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statusOptionText: {
    color: theme.colors.foreground,
    fontSize: 11,
    fontWeight: "700",
  },
  statusOptionTextActive: { color: theme.colors.background },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  disabled: { opacity: 0.45 },
  submitText: { color: theme.colors.background, fontWeight: "800" },
}));
