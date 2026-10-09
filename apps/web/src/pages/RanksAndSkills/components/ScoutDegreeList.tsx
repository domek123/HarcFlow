import type { ScoutDegree } from "@harcapp/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { formatDate } from "@harcapp/utils";

type Props = {
  degrees: ScoutDegree[];
  activeDegree?: ScoutDegree;
  selectedDegree?: ScoutDegree;
  onSelect: (degreeId: string) => void;
};

function DegreeButton({
  degree,
  selected,
  onSelect,
}: {
  degree: ScoutDegree;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <Button
      variant={selected ? "secondary" : "ghost"}
      className="h-auto w-full justify-start border border-transparent p-3 text-left hover:border-border hover:bg-muted/60 data-[variant=secondary]:border-primary/20 data-[variant=secondary]:bg-primary/5 data-[variant=secondary]:hover:border-primary/20 data-[variant=secondary]:hover:bg-primary/5"
      aria-current={selected ? "true" : undefined}
      onClick={() => onSelect(degree.id)}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 font-medium">
          <span className="truncate">
            {t(`enums.degree.${degree.degree.degree}`)}
          </span>
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {t("ranksAndSkills.list.approvedCount", {
            approved: degree.tasks.filter((task) => task.status === "APPROVED")
              .length,
            total: degree.tasks.length,
          })}
        </span>
      </span>
      <Badge
        variant={degree.status === "COMPLETED" ? "secondary" : "outline"}
        className="ml-2 shrink-0 text-[10px]"
      >
        {t(`ranksAndSkills.degreeStatuses.${degree.status}`)}
      </Badge>
    </Button>
  );
}

export function ScoutDegreeList({
  degrees,
  activeDegree,
  selectedDegree,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  const otherDegrees = degrees.filter(
    (degree) => degree.status !== "COMPLETED" && degree.id !== activeDegree?.id,
  );
  const completedDegrees = degrees.filter(
    (degree) => degree.status === "COMPLETED",
  );

  return (
    <Card className="h-fit overflow-hidden p-0 lg:sticky lg:top-4">
      <CardHeader className="border-b bg-muted/20 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{t("ranksAndSkills.list.title")}</CardTitle>
          <Badge variant="secondary">{degrees.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <section className="space-y-2">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("ranksAndSkills.list.current")}
            <span className="h-px flex-1 bg-border" />
          </p>
          {activeDegree ? (
            <DegreeButton
              degree={activeDegree}
              selected={selectedDegree?.id === activeDegree.id}
              onSelect={onSelect}
            />
          ) : (
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              {t("ranksAndSkills.list.noActive")}
            </p>
          )}
        </section>
        <section className="space-y-2">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("ranksAndSkills.list.other")}
            <span className="h-px flex-1 bg-border" />
          </p>
          {otherDegrees.map((degree) => (
            <DegreeButton
              key={degree.id}
              degree={degree}
              selected={selectedDegree?.id === degree.id}
              onSelect={onSelect}
            />
          ))}
          {otherDegrees.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("ranksAndSkills.list.noOther")}
            </p>
          )}
        </section>
        <section className="space-y-2">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("ranksAndSkills.list.history")}
            <span className="h-px flex-1 bg-border" />
          </p>
          {completedDegrees.map((degree) => (
            <Button
              key={degree.id}
              variant={selectedDegree?.id === degree.id ? "secondary" : "ghost"}
              className="h-auto w-full justify-start p-3 text-left"
              onClick={() => onSelect(degree.id)}
            >
              <span>
                <span className="font-medium flex gap-x-1 items-center">
                  {degree.degree.degree}
                </span>
                <span className="flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground wrap-break-word">
                  {formatDate(degree.startedAt)} -{" "}
                  {formatDate(degree.completedAt)}
                </span>
              </span>
            </Button>
          ))}
          {completedDegrees.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("ranksAndSkills.list.noCompleted")}
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
