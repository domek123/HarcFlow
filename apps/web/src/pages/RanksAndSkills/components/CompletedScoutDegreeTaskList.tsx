import type { ScoutDegreeTask } from "@harcapp/types";

type Props = {
  task: ScoutDegreeTask;
};

export function CompletedScoutDegreeTaskList({ task }: Props) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border bg-background p-3">
      <span className="min-w-0 flex-1 wrap-break-word text-sm font-medium">
        {task.description}
      </span>
    </div>
  );
}
