import { useState } from "react";
import { Text, View } from "react-native";

import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { showToast } from "@/utils/toast";
import { useDeleteTroopMember } from "@harcapp/api-client";
import { ScoutProfileDTO } from "@harcapp/types";

import { getAgeFromBirthDate } from "../utils/getAgeFromBirthDate";
import { AddMemberModal } from "./AddMemberModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { ActionButton, ActionRow, DetailRow } from "./SharedUI";

export function MemberPersonalInfoSection({
  member,
}: {
  member: ScoutProfileDTO;
}) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const hasPatrol =
    member?.function !== "DRUZYNOWY" &&
    member?.function !== "PRZYBOCZNY" &&
    Boolean(member?.patrol);

  const { mutate: deleteTroopMember } = useDeleteTroopMember(member.troopId);

  const handleDelete = () => {
    deleteTroopMember(member.id, {
      onSuccess: () => {
        showToast.success(t("dashboard.memberDetails.deleteMemberSuccess"));
        setIsDeleteUserModalOpen(false);
        router.back();
      },
      onError: () => {
        showToast.error(t("dashboard.memberDetails.deleteMemberError"));
      },
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t("dashboard.memberDetails.personalData")}
      </Text>
      {member && (
        <>
          <DetailRow
            label={t("dashboard.memberDetails.firstName")}
            value={member.firstName}
          />
          <DetailRow
            label={t("dashboard.memberDetails.lastName")}
            value={member.lastName}
          />
          <DetailRow
            label={t("dashboard.memberDetails.age")}
            value={getAgeFromBirthDate(member.birthDate)}
          />
          {hasPatrol && (
            <DetailRow
              label={t("dashboard.memberDetails.patrol")}
              value={member.patrol!.name}
            />
          )}
          <DetailRow
            label={t("dashboard.memberDetails.function")}
            value={t(`enums.function.${member.function}`)}
          />
          <DetailRow
            label={t("dashboard.memberDetails.scoutDegree")}
            value={t(`enums.degree.${member.degree}`)}
          />
          <DetailRow
            label={t("dashboard.memberDetails.instructorRank")}
            value={t(`enums.rank.${member.rank}`)}
          />
        </>
      )}
      <ActionRow>
        <ActionButton
          label={t("dashboard.memberDetails.edit")}
          icon="pencil"
          onPress={() => setIsEditModalOpen(true)}
        />
        <ActionButton
          label={t("dashboard.memberDetails.delete")}
          icon="trash"
          danger
          onPress={() => setIsDeleteUserModalOpen(true)}
        />
      </ActionRow>

      <AddMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        memberToEdit={member}
      />
      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        text={t("dashboard.memberDetails.deleteMemberMessage")}
        onClose={() => setIsDeleteUserModalOpen(false)}
        onDelete={handleDelete}
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
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "800",
  },
}));
