import { CheckCircle2, ClipboardList, Plus, Trash2 } from "lucide-react";
import {
  type ScoutDegree,
  type ScoutDegreeTask,
  type ScoutDegreeTaskStatus,
} from "@harcapp/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CompletedScoutDegreeTaskList } from "./CompletedScoutDegreeTaskList";
import { ScoutDegreeTaskCard } from "./ScoutDegreeTaskCard";
import { formatDate } from "@harcapp/utils";
import { useTranslation } from "react-i18next";

type Props = {
  degree: ScoutDegree;
  canEdit: boolean;
  statusPending: boolean;
  newDescription: string;
  onNewDescriptionChange: (value: string) => void;
  onSaveTask: (taskId: string, description: string) => void;
  onStatusChange: (taskId: string, status: ScoutDegreeTaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
  onOpen: () => void;
  onComplete: () => void;
  onDelete: () => void;
  completionPending: boolean;
  deletionPending: boolean;
};

export function ScoutDegreeDetails({
  degree,
  canEdit,
  statusPending,
  newDescription,
  onNewDescriptionChange,
  onSaveTask,
  onStatusChange,
  onDeleteTask,
  onAddTask,
  onOpen,
  onComplete,
  onDelete,
  completionPending,
  deletionPending,
}: Props) {
  const { t } = useTranslation();

  const approvedCount = degree.tasks.filter(
    (task) => task.status === "APPROVED",
  ).length;

  const progress = degree.tasks.length
    ? Math.round((approvedCount / degree.tasks.length) * 100)
    : 0;

  const canComplete =
    canEdit &&
    degree.status === "IN_PROGRESS" &&
    degree.tasks.length > 0 &&
    degree.tasks.every((task) => task.status === "APPROVED");

  const renderTasks = (source: ScoutDegreeTask["source"]) =>
    degree.tasks
      .filter((task) => task.source === source)
      .map((task) =>
        degree.status === "COMPLETED" ? (
          <CompletedScoutDegreeTaskList key={task.id} task={task} />
        ) : (
          <ScoutDegreeTaskCard
            degreeStatus={degree.status}
            key={task.id}
            task={task}
            readOnly={!canEdit}
            statusPending={statusPending}
            onSave={onSaveTask}
            onStatusChange={onStatusChange}
            onDelete={onDeleteTask}
          />
        ),
      );

  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="border-b bg-muted/20 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">
              {t("ranksAndSkills.details.title", {
                degree: t(`enums.degree.${degree.degree.degree}`),
              })}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {degree.status === "IN_PROGRESS" &&
                t("ranksAndSkills.details.startedAt", {
                  startedAt: formatDate(degree.startedAt),
                })}

              {degree.status === "COMPLETED" &&
                t("ranksAndSkills.details.completedAt", {
                  completedAt: formatDate(degree.completedAt),
                  orderNumber: degree.orderNumber,
                })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{t(`ranksAndSkills.degreeStatuses.${degree.status}`)}</Badge>
            {degree.status === "PREPARED" && (
              <Button size="sm" onClick={onOpen}>
                {t("ranksAndSkills.details.openTrial")}
              </Button>
            )}
            {canComplete && (
              <Button
                size="sm"
                disabled={completionPending}
                onClick={onComplete}
              >
                {t("ranksAndSkills.details.completeTrial")}
              </Button>
            )}
            {degree.status === "COMPLETED" && (
              <Button
                size="icon"
                variant="destructive"
                aria-label={t("ranksAndSkills.details.deleteTrialIconLabel")}
                title={t("ranksAndSkills.details.deleteTrialIconLabel")}
                disabled={deletionPending}
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4 pt-5">
        {canEdit && (
          <div className="rounded-lg border bg-background p-4">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="size-4 text-emerald-600" />{" "}
                {t("ranksAndSkills.details.progress")}
              </span>
              <span className="text-muted-foreground">
                {t("ranksAndSkills.details.approvedCount", {
                  approved: approvedCount,
                  total: degree.tasks.length,
                })}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-emerald-600 transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="size-4 text-muted-foreground" />{" "}
            {t("ranksAndSkills.details.templateTasks")}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (
              {degree.tasks.filter((task) => task.source === "TEMPLATE").length}
              )
            </span>
          </h3>
          {renderTasks("TEMPLATE")}
        </section>
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="size-4 text-muted-foreground" />{" "}
            {t("ranksAndSkills.details.individualTasks")}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (
              {
                degree.tasks.filter((task) => task.source === "INDIVIDUAL")
                  .length
              }
              )
            </span>
          </h3>
          {renderTasks("INDIVIDUAL")}
          {canEdit && (
            <div className="space-y-2 rounded-lg border border-dashed bg-muted/10 p-4">
              <Input
                placeholder={t("ranksAndSkills.details.newTaskPlaceholder")}
                value={newDescription}
                onChange={(event) => onNewDescriptionChange(event.target.value)}
              />
              <Button
                size="sm"
                disabled={!newDescription.trim()}
                onClick={onAddTask}
              >
                <Plus className="size-4" />{" "}
                {t("ranksAndSkills.details.addIndividualTask")}
              </Button>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
