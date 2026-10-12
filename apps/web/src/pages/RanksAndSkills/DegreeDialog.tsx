import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { DegreeSelect } from "@/components/DegreeSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateDegree } from "@harcapp/api-client";
import {
  Degree,
  DEGREE_ORDER,
  type ScoutProfileDevelopmentDTO,
} from "@harcapp/types";

type DegreeDialogProps = {
  isDegreeDialogOpen: boolean;
  setIsDegreeDialogOpen: (val: boolean) => void;
  member: ScoutProfileDevelopmentDTO | null;
};

export function DegreeDialog({
  isDegreeDialogOpen,
  setIsDegreeDialogOpen,
  member,
}: DegreeDialogProps) {
  const { t } = useTranslation();
  const { id: troopId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useUpdateDegree(troopId);

  const [degree, setDegree] = useState<Degree>(Degree.NONE);
  const [plannedDegree, setPlannedDegree] = useState<Degree>(Degree.NONE);

  useEffect(() => {
    if (!isDegreeDialogOpen || !member) {
      return;
    }

    setDegree(member.degree);
    setPlannedDegree(member.acquiringDegree);
  }, [isDegreeDialogOpen, member]);

  const handleSubmit = () => {
    if (!member) return;

    const payload = {
      profileId: member.id,
      degree,
      acquiringDegree: plannedDegree,
    };

    toast.promise(mutateAsync(payload), {
      success: () => {
        setIsDegreeDialogOpen(false);
        return t("ranksAndSkills.degreeDialog.saveSuccess");
      },
      error: () => {
        return t("ranksAndSkills.degreeDialog.saveError");
      },
    });
  };

  return (
    <Dialog open={isDegreeDialogOpen} onOpenChange={setIsDegreeDialogOpen}>
      <DialogContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="space-y-5"
        >
          <DialogHeader>
            <DialogTitle>
              {member?.firstName} {member?.lastName}
            </DialogTitle>
            <DialogDescription>
              {t("ranksAndSkills.degreeDialog.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="member-degree" className="text-sm font-medium">
                {t("ranksAndSkills.degreeDialog.degree")}
              </label>

              <DegreeSelect
                selectedDegree={degree}
                setSelectedDegree={(value) => setDegree(value ?? Degree.NONE)}
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="member-planned-degree"
                className="text-sm font-medium"
              >
                {t("ranksAndSkills.degreeDialog.plannedDegree")}
              </label>

              <DegreeSelect
                selectedDegree={plannedDegree}
                setSelectedDegree={(value) =>
                  setPlannedDegree(value ?? Degree.NONE)
                }
                disableAfter={DEGREE_ORDER.indexOf(degree)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDegreeDialogOpen(false)}
            >
              {t("ranksAndSkills.degreeDialog.cancel")}
            </Button>

            <Button type="submit" disabled={isPending}>
              {t("ranksAndSkills.degreeDialog.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
