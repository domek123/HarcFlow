import { TableRow, TableCell } from "@/components/ui/table";
import {
  BadgeStatus,
  DegreeMaxAge,
  type ScoutProfileDevelopmentDTO,
  getBadgeById,
} from "@harcapp/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MemberActionsMenu } from "./MemberActionsMenu";
import { Badge } from "@/components/ui/badge";
import { getAgeFromBirthDate } from "@harcapp/utils";

type MemberRowProps = {
  member: ScoutProfileDevelopmentDTO;
  isExpanded: boolean;
  wonBadges: number;
  onToggle: () => void;
  onDegreeClick: () => void;
};

export function MemberRows({
  member,
  isExpanded,
  wonBadges,
  onToggle,
  onDegreeClick,
}: MemberRowProps) {
  const { t } = useTranslation();

  const memberAge = getAgeFromBirthDate(member.birthDate);
  const isMemberDegreeAdequate =
    memberAge !== undefined && memberAge <= DegreeMaxAge[member.degree];

  const isMemberAcquiringDegreeAdequate =
    memberAge !== undefined &&
    memberAge <= DegreeMaxAge[member.acquiringDegree];

  const fullName = `${member.firstName} ${member.lastName}`;

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <TableCell>
          <div className="flex items-center gap-2 font-medium">
            {isExpanded ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
            {fullName}
          </div>
        </TableCell>
        <TableCell>{memberAge}</TableCell>
        <TableCell>{t(`enums.rank.${member.rank}`)}</TableCell>
        <TableCell
          className={!isMemberDegreeAdequate ? "text-destructive" : undefined}
        >
          {t(`enums.degree.${member.degree}`)}
        </TableCell>

        <TableCell
          className={
            !isMemberAcquiringDegreeAdequate ? "text-destructive" : undefined
          }
        >
          {t(`enums.degree.${member.acquiringDegree}`)}
        </TableCell>
        <TableCell className="text-center">
          <Badge variant="secondary">{wonBadges}</Badge>
        </TableCell>
        <TableCell className="text-right">
          <MemberActionsMenu onDegreeClick={onDegreeClick} />
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/20 hover:bg-muted/20">
          <TableCell colSpan={7} className="p-0">
            <div className="border-t px-6 py-4">
              <h3 className="mb-3 text-sm font-semibold">
                {t("ranksAndSkills.badges.title")}
              </h3>
              {member.badges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("ranksAndSkills.badges.empty")}
                </p>
              ) : (
                <div className="divide-y rounded-md border bg-background">
                  {member.badges.map((badge) => {
                    const badgeDefinition = getBadgeById(badge.badgeId);

                    return (
                      <div
                        key={badge.badgeId}
                        className="flex items-center justify-between gap-4 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {badgeDefinition?.name ?? badge.badgeId}
                          </span>
                          <span className="text-amber-600">
                            {badgeDefinition?.level
                              ? `${"★".repeat(badgeDefinition.level)}${"☆".repeat(3 - badgeDefinition.level)}`
                              : "M"}
                          </span>
                        </div>

                        <Badge variant={statusVariant(badge.status)}>
                          {t(`ranksAndSkills.status.${badge.status}`)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function statusVariant(status: BadgeStatus) {
  if (status === "WON") return "default" as const;
  if (status === "COMPLETED") return "secondary" as const;
  return "outline" as const;
}
