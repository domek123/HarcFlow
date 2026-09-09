import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.tsx";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog.tsx";
import { supabase } from "@/lib/supabase.ts";
import { useDeleteTroop } from "@harcapp/api-client";
import type { TroopDTO } from "@harcapp/types";

type DeleteTroopModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  troop: Pick<TroopDTO, "id" | "name">;
};

export function DeleteTroopModal({
  isOpen,
  troop,
  setIsOpen,
}: DeleteTroopModalProps) {
  const { t } = useTranslation();

  const { mutateAsync, isPending } = useDeleteTroop(supabase);

  const handleDelete = async () => {
    if (!troop?.id) return;

    toast.promise(mutateAsync(troop.id), {
      success: () => {
        setIsOpen(false);
        return t("dashboard.deleteTroopSuccess");
      },
      error: () => {
        setIsOpen(false);
        return t("dashboard.deleteTroopError");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dashboard.deleteTroopTitle")}</DialogTitle>
          <DialogDescription>
            {t("dashboard.deleteTroopDescription", { name: troop.name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col space-y-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("dashboard.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {t("dashboard.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
