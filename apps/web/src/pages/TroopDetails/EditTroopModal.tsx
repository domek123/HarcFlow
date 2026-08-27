import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
import { useUpdateTroop } from "@harcapp/api";
import type { TroopDTO } from "@harcapp/types";
import {
  type UpdateTroopFormValues,
  updateTroopSchema,
} from "@harcapp/validators";
import { useEffect } from "react";

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
      creationYear: 0,
    },
  });

  const onSubmit = async (data: UpdateTroopFormValues) => {
    await updateTroop({ id: troop.id, dto: data });
    onOpenChange(false);
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        name: troop.name,
        description: troop.description ?? "",
        creationYear: troop.creationYear,
      });
    }
  }, [isOpen, reset, troop]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {t("troopDetails.editTroopModal.title", "Edytuj dane drużyny")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "troopDetails.editTroopModal.description",
                "Zmień nazwę, opis lub rok założenia drużyny.",
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="troopName">
                {t("troopDetails.editTroopModal.name", "Nazwa drużyny")}
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
                {t("troopDetails.editTroopModal.descriptionLabel", "Opis")}
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
                {t("troopDetails.editTroopModal.creationYear", "Rok założenia")}
              </Label>
              <Input
                id="troopCreationYear"
                type="number"
                {...register("creationYear")}
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
              {isPending
                ? t("saving", "Zapisywanie...")
                : t("troopDetails.editModal.save", "Zapisz zmiany")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
