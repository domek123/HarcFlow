import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button.tsx";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { supabase } from "@/lib/supabase.ts";
import { useCreateTroop } from "@harcapp/api";
import {
  type CreateTroopInput,
  createTroopSchema,
  defaultValues,
} from "@harcapp/validators";

export const AddTroopModal = () => {
  const { t } = useTranslation();

  const { mutate, isError, error, isPending } = useCreateTroop(supabase);

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTroopInput>({
    resolver: zodResolver(createTroopSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: CreateTroopInput) => {
    mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
        {t("dashboard.addButton")}
      </DialogTrigger>

      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{t("dashboard.addTroop.title")}</DialogTitle>
          <DialogDescription>
            {t("dashboard.addTroop.mainDescription")}
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-troop-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 my-2"
        >
          <div className="space-y-2">
            <Label htmlFor="name">{t("dashboard.addTroop.name.label")}</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t("dashboard.addTroop.name.placeholder")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("dashboard.addTroop.description.label")}
            </Label>
            <Input
              id="description"
              {...register("description")}
              placeholder={t("dashboard.addTroop.description.placeholder")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>

        {isError && (
          <p className="text-sm text-destructive">{(error as Error).message}</p>
        )}

        <DialogFooter>
          <Button
            type="submit"
            form="add-troop-form"
            disabled={isPending}
            className="w-full"
          >
            {isPending
              ? t("dashboard.addTroop.loading")
              : t("dashboard.addButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
