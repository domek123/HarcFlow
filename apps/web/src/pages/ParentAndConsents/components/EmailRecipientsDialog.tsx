import { Check, Copy, Mail, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { EmailMode, ParentContact } from "../types";

interface EmailRecipientsDialogProps {
  parents: ParentContact[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: EmailMode;
  onModeChange: (mode: EmailMode) => void;
  selectedIds: string[];
  selectedCount: number;
  emails: string[];
  copySuccess: boolean;
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onCopy: () => void;
  onOpenEmailClient: () => void;
}

export function EmailRecipientsDialog(props: EmailRecipientsDialogProps) {
  const { t } = useTranslation();
  const visibleIds = props.parents.map((parent) => parent.id);
  const allSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => props.selectedIds.includes(id));

  const someSelected =
    visibleIds.length > 0 &&
    visibleIds.some((id) => props.selectedIds.includes(id));

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("contacts.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("contacts.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-visible-parents"
              checked={allSelected}
              onCheckedChange={(checked) =>
                props.onToggleAll(visibleIds, checked === true)
              }
              indicator={
                allSelected ? (
                  <Check className="pointer-events-none size-3.5" />
                ) : someSelected ? (
                  <Minus className="pointer-events-none size-3.5" />
                ) : null
              }
            />
            <label
              htmlFor="select-visible-parents"
              className="cursor-pointer text-sm font-medium"
            >
              {t("contacts.dialog.selectVisible")}
            </label>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-lg border">
            {!props.parents.length ? (
              <p className="p-4 text-sm text-muted-foreground">
                {t("contacts.dialog.noEmails")}
              </p>
            ) : (
              props.parents.map((parent) => (
                <label
                  key={parent.id}
                  className="flex cursor-pointer items-start gap-3 border-b p-3 last:border-b-0 hover:bg-muted/50"
                >
                  <Checkbox
                    checked={props.selectedIds.includes(parent.id)}
                    onCheckedChange={(checked) =>
                      props.onToggle(parent.id, checked === true)
                    }
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {parent.firstName} {parent.lastName}
                    </span>
                    <span className="block break-all text-sm text-muted-foreground">
                      {parent.email}
                    </span>
                  </span>
                </label>
              ))
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t("contacts.dialog.modeLabel")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant={props.mode === "bcc" ? "default" : "outline"}
                className="flex-1"
                onClick={() => props.onModeChange("bcc")}
              >
                {t("contacts.dialog.bcc")}
              </Button>
              <Button
                type="button"
                variant={props.mode === "to" ? "default" : "outline"}
                className="flex-1"
                onClick={() => props.onModeChange("to")}
              >
                {t("contacts.dialog.to")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(`contacts.dialog.modeDescription.${props.mode}`)}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("contacts.dialog.recipientList")}
            </label>
            <textarea
              readOnly
              value={props.emails.join(", ")}
              placeholder={t("contacts.dialog.recipientPlaceholder")}
              className="min-h-24 w-full resize-y rounded-md border bg-muted/30 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {props.copySuccess && (
            <p className="text-sm text-green-600">
              {t("contacts.dialog.copySuccess")}
            </p>
          )}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={props.onCopy}
            disabled={!props.emails.length}
          >
            <Copy className="mr-2 h-4 w-4" />
            {t("contacts.dialog.copy")}
          </Button>
          <Button
            type="button"
            onClick={props.onOpenEmailClient}
            disabled={!props.emails.length}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t("contacts.dialog.openMail")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
