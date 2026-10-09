import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useGetScoutsDevelopmentProfile } from "@harcapp/api-client";
import { BadgeStatus, type ScoutProfileDevelopmentDTO } from "@harcapp/types";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

import { DegreeDialog } from "./DegreeDialog";
import { MemberRows } from "./MemberRow";
import { DevelopmentProfileSkeleton } from "./DevelopmentProfileSkeleton";
import { DevelopmentStats } from "./DevelopmentStats";

export function RanksAndSkillsPage() {
  const { t } = useTranslation();
  const { id: troopId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const profileQuery = useGetScoutsDevelopmentProfile(supabase, troopId);

  const [selectedMember, setSelectedMember] =
    useState<ScoutProfileDevelopmentDTO | null>(null);

  if (profileQuery.isLoading) {
    return <DevelopmentProfileSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm text-destructive">{t("ranksAndSkills.error")}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => profileQuery.refetch()}
        >
          {t("ranksAndSkills.retry")}
        </Button>
      </div>
    );
  }

  const members = profileQuery.data ?? [];

  if (members.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {t("ranksAndSkills.empty")}
      </div>
    );
  }

  return (
    <>
      <DevelopmentStats members={members} />
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ranksAndSkills.table.member")}</TableHead>
              <TableHead>{t("ranksAndSkills.table.age")}</TableHead>
              <TableHead>{t("ranksAndSkills.table.rank")}</TableHead>
              <TableHead>{t("ranksAndSkills.table.degree")}</TableHead>
              <TableHead>{t("ranksAndSkills.table.acquiringDegree")}</TableHead>
              <TableHead className="w-32 text-center">
                {t("ranksAndSkills.table.badges")}
              </TableHead>
              <TableHead className="w-12 text-right">
                {t("ranksAndSkills.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const isExpanded = expandedMemberId === member.id;
              const wonBadges = (member.badges ?? []).filter(
                (badge) =>
                  badge.status === BadgeStatus.COMPLETED ||
                  badge.status === BadgeStatus.WON,
              ).length;

              return (
                <MemberRows
                  key={member.id}
                  member={member}
                  isExpanded={isExpanded}
                  wonBadges={wonBadges}
                  onToggle={() =>
                    setExpandedMemberId(isExpanded ? null : member.id)
                  }
                  onTrialClick={() =>
                    navigate(`/troop/${troopId}/ranks-and-skills/${member.id}`)
                  }
                  onDegreeClick={() => setSelectedMember(member)}
                />
              );
            })}
          </TableBody>
        </Table>
        <DegreeDialog
          isDegreeDialogOpen={selectedMember !== null}
          setIsDegreeDialogOpen={(open) => {
            if (!open) {
              setSelectedMember(null);
            }
          }}
          member={selectedMember}
        />
      </div>
    </>
  );
}
