import { useMemo } from "react";

import type { ScoutProfileDevelopmentDTO } from "@harcapp/types";
import { DegreeMaxAge } from "@harcapp/types";
import { getAgeFromBirthDate } from "@harcapp/utils";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type DevelopmentStatsProps = {
  members: ScoutProfileDevelopmentDTO[];
};

export function DevelopmentStats({ members }: DevelopmentStatsProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    let adequateDegree = 0;
    let adequateAcquiringDegree = 0;

    members.forEach((member) => {
      const age = getAgeFromBirthDate(member.birthDate);

      if (age == null) return;

      if (age <= DegreeMaxAge[member.degree]) {
        adequateDegree++;
      }

      if (age <= DegreeMaxAge[member.acquiringDegree]) {
        adequateAcquiringDegree++;
      }
    });

    const percentage = (value: number) =>
      members.length > 0 ? Math.round((value / members.length) * 100) : 0;

    return {
      adequateDegree: percentage(adequateDegree),
      adequateAcquiringDegree: percentage(adequateAcquiringDegree),
    };
  }, [members]);

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center gap-6 px-4 py-3">
        <span className="shrink-0 text-sm font-semibold">
          {t("ranksAndSkills.stats.title")}
        </span>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0 text-sm text-muted-foreground">
            {t("ranksAndSkills.AdequateDegree")}
          </span>

          <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${stats.adequateDegree}%` }}
            />
          </div>

          <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums">
            {stats.adequateDegree}%
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0 text-sm text-muted-foreground">
            {t("ranksAndSkills.AdequateAcquiringDegree")}
          </span>

          <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${stats.adequateAcquiringDegree}%` }}
            />
          </div>

          <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums">
            {stats.adequateAcquiringDegree}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
