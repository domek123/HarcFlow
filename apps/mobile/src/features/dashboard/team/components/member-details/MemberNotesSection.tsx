import { useState } from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { supabase } from "@/lib/supabase";
import { useDeleteScoutNote } from "@harcapp/api-client";
import { ScoutNoteDTO } from "@harcapp/types";

import { AddNoteModal } from "../modals/AddNoteModal";
import { ActionButton } from "../shared/SharedUI";

export function MemberNotesSection({
  notes,
  profileId,
}: {
  notes?: ScoutNoteDTO[];
  profileId: string;
}) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const { mutate: deleteNote } = useDeleteScoutNote(supabase, profileId);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t("dashboard.memberDetails.notes")}
        </Text>
        <ActionButton
          label={t("dashboard.memberDetails.addNote")}
          icon="add"
          onPress={() => setIsNoteModalOpen(true)}
        />
      </View>
      {notes && notes.length > 0 ? (
        notes.map((note) => (
          <View key={note.id} style={styles.noteItem}>
            <Text style={styles.noteText}>{note.content}</Text>
            <Text style={styles.noteAuthor}>
              {t("dashboard.memberDetails.noteAuthor")}: {note.authorName}
            </Text>
            <Text style={styles.noteDate}>
              {new Date(note.createdAt).toLocaleDateString("pl-PL")}
            </Text>
            <ActionButton
              label={t("dashboard.memberDetails.deleteNote")}
              icon="trash"
              danger
              onPress={() => deleteNote(note.id)}
            />
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>-</Text>
      )}

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        profileId={profileId}
      />
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },
  noteItem: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 6,
  },
  noteText: {
    color: theme.colors.foreground,
    fontSize: 14,
    lineHeight: 20,
  },
  noteAuthor: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
  },
  noteDate: {
    color: theme.colors.mutedForeground,
    fontSize: 11,
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
  },
}));
