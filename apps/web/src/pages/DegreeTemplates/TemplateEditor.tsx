import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Degree, type DegreeTemplateTask } from "@harcapp/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TemplateEditorProps = {
  degree: Degree;
  tasks: DegreeTemplateTask[];
  isCreating: boolean;
  onChange: (form: DegreeTemplateTask[]) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function TemplateEditor({
  degree,
  tasks,
  isCreating,
  onChange,
  onCancel,
  onSave,
}: TemplateEditorProps) {
  const { t } = useTranslation();

  const updateTask = (taskId: string, description: string) => {
    onChange(
      tasks.map((task) =>
        task.id === taskId ? { ...task, description } : task,
      ),
    );
  };

  const addTask = () => {
    onChange([
      ...tasks,
      {
        id: `task-${Date.now()}`,
        description: "",
        position: tasks.length,
      },
    ]);
  };

  const removeTask = (taskId: string) => {
    onChange(
      tasks
        .filter((task) => task.id !== taskId)
        .map((task, index) => ({
          ...task,
          position: index,
        })),
    );
  };

  const reorderTasks = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    const sourceIndex = tasks.findIndex((task) => task.id === sourceId);

    const targetIndex = tasks.findIndex((task) => task.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const reorderedTasks = [...tasks];

    const [movedTask] = reorderedTasks.splice(sourceIndex, 1);

    reorderedTasks.splice(targetIndex, 0, movedTask);

    onChange(
      reorderedTasks.map((task, index) => ({
        ...task,
        position: index,
      })),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCreating
            ? t("degreeTemplates.editor.newTitle")
            : t("degreeTemplates.editor.editTitle")}
        </CardTitle>

        <CardDescription>{t(`enums.degree.${degree}`)}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label>
                {t("degreeTemplates.editor.tasks")} ({tasks.length})
              </Label>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTask}
              >
                <Plus />
                {t("degreeTemplates.editor.addTask")}
              </Button>
            </div>

            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2"
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();

                    reorderTasks(
                      event.dataTransfer.getData("text/plain"),
                      task.id!,
                    );
                  }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", task.id!);
                    }}
                    aria-label={t("degreeTemplates.editor.dragTask", {
                      number: index + 1,
                    })}
                    title={t("degreeTemplates.editor.dragTask", {
                      number: index + 1,
                    })}
                  >
                    <GripVertical />
                  </Button>

                  <Input
                    value={task.description ?? ""}
                    onChange={(event) =>
                      updateTask(task.id!, event.target.value)
                    }
                    placeholder={t("degreeTemplates.editor.taskPlaceholder", {
                      number: index + 1,
                    })}
                    aria-label={t("degreeTemplates.editor.taskPlaceholder", {
                      number: index + 1,
                    })}
                    required
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeTask(task.id!)}
                    aria-label={t("degreeTemplates.editor.removeTask", {
                      number: index + 1,
                    })}
                    title={t("degreeTemplates.editor.removeTask", {
                      number: index + 1,
                    })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("degreeTemplates.editor.cancel")}
            </Button>

            <Button type="submit">{t("degreeTemplates.editor.save")}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
