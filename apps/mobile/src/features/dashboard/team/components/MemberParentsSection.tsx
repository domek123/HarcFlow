import { useState } from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import { useDeleteParent } from "@harcapp/api-client";
import { ParentDTO } from "@harcapp/types";

import { AddEditParentModal } from "./AddEditParentModal";
import { DeleteParentModal } from "./DeleteParentModal";
import { ActionButton, ActionRow, DetailRow } from "./SharedUI";

export function MemberParentsSection({
  parents,
  userId,
}: {
  parents?: ParentDTO[] | null;
  userId: string;
}) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const { mutate: deleteParent } = useDeleteParent(supabase, userId);

  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [parentToEdit, setParentToEdit] = useState<ParentDTO | null>(null);
  const [parentToDelete, setParentToDelete] = useState<ParentDTO | null>(null);

  const openParentModal = (parent?: ParentDTO) => {
    setParentToEdit(parent ?? null);
    setIsParentModalOpen(true);
  };

  const closeParentModal = () => {
    setIsParentModalOpen(false);
    setParentToEdit(null);
  };

  const handleDeleteParent = () => {
    if (parentToDelete)
      deleteParent(parentToDelete?.id, {
        onSuccess: () => {
          showToast.success(t("dashboard.memberDetails.deleteParentSuccess"));
          setParentToDelete(null);
        },
        onError: () => {
          showToast.error(t("dashboard.memberDetails.deleteParentError"));
        },
      });
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t("dashboard.memberDetails.parents")}
        </Text>
        <ActionButton
          label={t("dashboard.memberDetails.addParent")}
          icon="add"
          onPress={() => openParentModal()}
        />
      </View>
      {parents && parents.length > 0 ? (
        parents.map((parent) => (
          <View key={parent.id} style={styles.parentItem}>
            <Text style={styles.parentName}>
              {parent.firstName} {parent.lastName}
            </Text>
            <DetailRow
              label={t("dashboard.memberDetails.phone")}
              value={parent.phoneNumber}
            />
            <DetailRow
              label={t("dashboard.memberDetails.email")}
              value={parent.email}
            />
            <ActionRow>
              <ActionButton
                label={t("dashboard.memberDetails.editParent")}
                icon="pencil"
                onPress={() => openParentModal(parent)}
              />
              <ActionButton
                label={t("dashboard.memberDetails.deleteParent")}
                icon="trash"
                danger
                onPress={() => setParentToDelete(parent)}
              />
            </ActionRow>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>-</Text>
      )}

      <AddEditParentModal
        isOpen={isParentModalOpen}
        onClose={closeParentModal}
        parent={parentToEdit ?? undefined}
        userId={userId}
      />
      <DeleteParentModal
        isOpen={parentToDelete !== null}
        text={t("dashboard.memberDetails.deleteParentMessage", {
          parentName: parentToDelete
            ? `${parentToDelete.firstName} ${parentToDelete.lastName}`
            : "",
        })}
        onClose={() => setParentToDelete(null)}
        onDelete={handleDeleteParent}
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
  parentItem: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 4,
  },
  parentName: {
    color: theme.colors.foreground,
    fontSize: 15,
    fontWeight: "700",
  },
  emptyText: { color: theme.colors.mutedForeground, fontSize: 13 },
}));
