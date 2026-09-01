import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import {
  useCreateScoutNote,
  useFetchCurrentScoutProfile,
} from "@harcapp/api-client";

type AddNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
};

export const AddNoteModal = ({
  isOpen,
  onClose,
  profileId,
}: AddNoteModalProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const [content, setContent] = useState("");

  const { mutate: addNote } = useCreateScoutNote(supabase);
  const { data: currentScoutProfile } = useFetchCurrentScoutProfile(supabase);

  const handleSave = () => {
    if (!content.trim() || !currentScoutProfile) {
      return;
    }

    addNote(
      { content, profileId, authorId: currentScoutProfile?.userId },
      {
        onSuccess: () => {
          showToast.success(t("dashboard.memberDetails.addNoteSuccess"));
          setContent("");
          onClose();
        },
        onError: () => {
          showToast.error(t("dashboard.memberDetails.addNoteError"));
        },
      },
    );
  };

  const handleClose = () => {
    setContent("");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {t("dashboard.memberDetails.addNoteTitle")}
          </Text>
          <Text style={styles.label}>
            {t("dashboard.memberDetails.noteContent")}
          </Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholder={t("dashboard.memberDetails.notePlaceholder")}
            placeholderTextColor={styles.placeholder.color}
            style={styles.input}
          />

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>
                {t("dashboard.team.cancel")}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.saveButton,
                !content.trim() && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!content.trim()}
            >
              <Text style={styles.saveText}>{t("dashboard.team.save")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 12,
  },
  title: { color: theme.colors.foreground, fontSize: 22, fontWeight: "800" },
  label: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
  },
  placeholder: { color: theme.colors.mutedForeground },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabledButton: { opacity: 0.5 },
  cancelText: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "700",
  },
  saveText: {
    color: theme.colors.primaryForeground,
    fontSize: 14,
    fontWeight: "700",
  },
}));
