import { useLayoutEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import {
  ScoutDegreeStatus,
  ScoutDegreeTaskStatus,
  type ScoutDegreeTask,
} from "@harcapp/types";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { taskStatuses } from "../ScoutDegree.constants";

type Props = {
  task: ScoutDegreeTask;
  readOnly: boolean;
  statusPending: boolean;
  degreeStatus: ScoutDegreeStatus;
  onSave: (taskId: string, description: string) => void;
  onStatusChange: (taskId: string, status: ScoutDegreeTaskStatus) => void;
  onDelete: (taskId: string) => void;
};

export function ScoutDegreeTaskCard({
  task,
  readOnly,
  statusPending,
  onSave,
  onStatusChange,
  onDelete,
  degreeStatus,
}: Props) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const statusClassName = {
    TODO: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    SUBMITTED: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
    APPROVED:
      "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
  }[task.status];

  const resizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [task.description]);

  return (
    <div className="overflow-hidden rounded-lg border bg-background transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
      <div className="flex min-w-0 items-start gap-2 p-2">
        <textarea
          ref={textareaRef}
          defaultValue={task.description ?? ""}
          disabled={readOnly}
          aria-label={t("ranksAndSkills.task.descriptionLabel")}
          rows={1}
          onChange={(event) => {
            resizeTextarea(event.currentTarget);
          }}
          onBlur={(event) => {
            const element = event.currentTarget;
            const description = element.value;

            resizeTextarea(element);

            if (description !== (task.description ?? "")) {
              onSave(task.id, description);
            }
          }}
          className="min-h-9 min-w-0 flex-1 resize-none overflow-hidden rounded-md border-0 bg-transparent px-2 py-2 font-medium shadow-none focus-visible:outline-none focus-visible:ring-1"
        />

        {degreeStatus === "IN_PROGRESS" && (
          <Select
            value={task.status}
            onValueChange={(value) => {
              if (value) {
                onStatusChange(task.id, value as ScoutDegreeTaskStatus);
              }
            }}
            disabled={readOnly || statusPending}
          >
            <SelectTrigger
              className={`mt-1 h-7 w-auto shrink-0 rounded-full border px-3 text-xs font-medium shadow-none ${statusClassName}`}
              aria-label={t("ranksAndSkills.task.statusLabel")}
            >
              <SelectValue>
                {t(`ranksAndSkills.task.statuses.${task.status}`)}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {taskStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`ranksAndSkills.task.statuses.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {task.source === "INDIVIDUAL" && !readOnly && (
          <Button
            size="icon-sm"
            variant="ghost"
            className="mt-1 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={t("ranksAndSkills.task.delete")}
            title={t("ranksAndSkills.task.delete")}
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
