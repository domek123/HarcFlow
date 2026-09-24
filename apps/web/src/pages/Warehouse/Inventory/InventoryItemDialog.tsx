import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InventoryItemType } from "@harcapp/types";
import type { InventoryItem } from "@harcapp/types";
import {
  inventoryItemDefaultValues,
  inventoryItemSchema,
  type InventoryItemFormValues,
} from "@harcapp/validators";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { categoryLabelKeys } from "./warehouse.constants";

interface InventoryItemDialogProps {
  open: boolean;
  item: InventoryItem | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InventoryItemFormValues) => void;
}

export function InventoryItemDialog({
  open,
  item,
  isPending,
  onOpenChange,
  onSubmit,
}: InventoryItemDialogProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: inventoryItemDefaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        item
          ? { name: item.name, type: item.type, amount: item.amount }
          : inventoryItemDefaultValues,
      );
    }
  }, [item, open, reset]);

  const type = watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <DialogHeader>
            <DialogTitle>
              {item
                ? t("warehouse.form.editTitle")
                : t("warehouse.form.addTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("warehouse.form.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="inventory-name">{t("warehouse.form.name")}</Label>
              <Input
                id="inventory-name"
                placeholder={t("warehouse.form.namePlaceholder")}
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {t("warehouse.form.nameRequired")}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="inventory-type">{t("warehouse.form.type")}</Label>
              <Select
                value={type}
                onValueChange={(value) =>
                  setValue("type", value as InventoryItemType, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="inventory-type" className="w-full">
                  <SelectValue>
                    {type
                      ? t(categoryLabelKeys[type])
                      : t("warehouse.form.typePlaceholder")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(InventoryItemType).map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(categoryLabelKeys[value as InventoryItemType])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="inventory-amount">
                {t("warehouse.form.amount")}
              </Label>
              <Input
                id="inventory-amount"
                type="number"
                min={0}
                {...register("amount", { valueAsNumber: true })}
                aria-invalid={Boolean(errors.amount)}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">
                  {t("warehouse.form.amountError")}
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
              {t("warehouse.form.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("warehouse.form.saving")
                : t("warehouse.form.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
