import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useUpdateTroop } from "@harcapp/api-client";
import type { TroopDTO } from "@harcapp/types";
import {
  type UpdateTroopFormValues,
  updateTroopSchema,
} from "@harcapp/validators";

interface EditTroopModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  troop: Omit<TroopDTO, "memberCount">;
}

export const EditTroopModal: React.FC<EditTroopModalProps> = ({
  isOpen,
  onOpenChange,
  troop,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: updateTroop, isPending } = useUpdateTroop(supabase);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTroopFormValues>({
    resolver: zodResolver(updateTroopSchema),
    defaultValues: {
      name: "",
      description: "",
      creationYear: 2004,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: troop.name,
        description: troop.description ?? "",
        creationYear: troop.creationYear ?? undefined,
      });
    }
  }, [isOpen, reset, troop]);

  const onSubmit = (data: UpdateTroopFormValues) => {
    toast.promise(updateTroop({ id: troop.id, dto: data }), {
      loading: t("common.saving"),
      success: () => {
        onOpenChange(false);
        return t("troopDetails.editTroopModal.success");
      },
      error: () => t("troopDetails.editTroopModal.error"),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {t("troopDetails.editTroopModal.title", "Edytuj dane drużyny")}
            </DialogTitle>
            <DialogDescription>
              {t("troopDetails.editTroopModal.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="troopName">
                {t("troopDetails.editTroopModal.name")}
              </Label>
              <Input
                id="troopName"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {t(`${errors.name.message}`)}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="troopDescription">
                {t("troopDetails.editTroopModal.descriptionLabel")}
              </Label>
              <Input
                id="troopDescription"
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {t(`${errors.description.message}`)}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="troopCreationYear">
                {t("troopDetails.editTroopModal.creationYear")}
              </Label>
              <Input
                id="troopCreationYear"
                type="number"
                {...(register("creationYear"), { valueAsNumber: true })}
                aria-invalid={!!errors.creationYear}
              />
              {errors.creationYear && (
                <p className="text-xs text-destructive">
                  {t(`${errors.creationYear.message}`)}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("troopDetails.addModal.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("saving") : t("troopDetails.editModal.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
