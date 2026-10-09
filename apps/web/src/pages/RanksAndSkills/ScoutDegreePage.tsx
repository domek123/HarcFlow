import { useState } from "react";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { ScoutDegreeCreateCard } from "./components/ScoutDegreeCreateCard";
import { ScoutDegreeDetails } from "./components/ScoutDegreeDetails";
import { ScoutDegreeList } from "./components/ScoutDegreeList";
import { useScoutDegreePage } from "./hooks/useScoutDegreePage";

export function ScoutDegreePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const page = useScoutDegreePage();
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  if (page.isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        {t("ranksAndSkills.degreePage.loading")}
      </div>
    );
  }

  if (page.isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        {t("ranksAndSkills.degreePage.error")}
      </div>
    );
  }

  const openCompletionDialog = () => {
    setOrderNumber("");
    setIsCompletionDialogOpen(true);
  };

  const handleComplete = () => {
    if (!page.selectedDegree || !orderNumber.trim()) return;

    page.completeDegree(page.selectedDegree.id, orderNumber.trim());
    setIsCompletionDialogOpen(false);
  };

  const handleDelete = () => {
    if (!page.selectedDegree) return;

    page.deleteDegree(page.selectedDegree.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-full space-y-5">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-4" /> {t("ranksAndSkills.degreePage.back")}
      </Button>
      <div className="grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        <ScoutDegreeList
          degrees={page.degrees}
          activeDegree={page.activeDegree}
          selectedDegree={page.selectedDegree}
          onSelect={page.setSelectedId}
        />
        <div className="min-w-0 space-y-5">
          <ScoutDegreeCreateCard
            templates={page.templates}
            templateId={page.templateId}
            pending={page.createDegreePending}
            onTemplateChange={page.setTemplateId}
            onCreate={page.startTrial}
            memberDegree={page.memberDegree}
          />
          {page.selectedDegree ? (
            <ScoutDegreeDetails
              degree={page.selectedDegree}
              canEdit={page.canEditSelectedDegree}
              statusPending={page.updateTaskPending}
              completionPending={page.completeDegreePending}
              deletionPending={page.deleteDegreePending}
              newDescription={page.newDescription}
              onNewDescriptionChange={page.setNewDescription}
              onSaveTask={(taskId, description) =>
                page.saveTask(taskId, { description })
              }
              onStatusChange={page.changeStatus}
              onDeleteTask={page.deleteTask}
              onAddTask={page.addIndividualTask}
              onOpen={() => page.openDegree(page.selectedDegree!.id)}
              onComplete={openCompletionDialog}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 p-6 text-center">
              <ClipboardCheck className="mb-3 size-8 text-muted-foreground/70" />
              <p className="text-sm font-medium">
                {t("ranksAndSkills.degreePage.selectTrial")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("ranksAndSkills.degreePage.selectTrialDescription")}
              </p>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={isCompletionDialogOpen}
        onOpenChange={setIsCompletionDialogOpen}
      >
        <DialogContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              handleComplete();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {t("ranksAndSkills.completeTrial.title")}
              </DialogTitle>
              <DialogDescription>
                {t("ranksAndSkills.completeTrial.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <label htmlFor="order-number" className="text-sm font-medium">
                {t("ranksAndSkills.completeTrial.orderNumber")}
              </label>
              <Input
                id="order-number"
                value={orderNumber}
                minLength={1}
                required
                autoFocus
                onChange={(event) => setOrderNumber(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCompletionDialogOpen(false)}
              >
                {t("ranksAndSkills.completeTrial.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!orderNumber.trim() || page.completeDegreePending}
              >
                {t("ranksAndSkills.completeTrial.confirm")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("ranksAndSkills.deleteTrial.title")}</DialogTitle>
            <DialogDescription>
              {t("ranksAndSkills.deleteTrial.description", {
                degree: page.selectedDegree
                  ? t(`enums.degree.${page.selectedDegree.degree.degree}`)
                  : "",
                member: page.memberName,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("ranksAndSkills.deleteTrial.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={page.deleteDegreePending}
              onClick={handleDelete}
            >
              {t("ranksAndSkills.deleteTrial.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
