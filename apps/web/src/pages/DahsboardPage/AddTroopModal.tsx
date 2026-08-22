import { useState } from "react";

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

export const AddTroopModal = () => {
  const { t } = useTranslation();

  const createTroopMutation = useCreateTroop(supabase);

  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddTroop = () => {
    if (!newName.trim()) return;

    createTroopMutation.mutate(
      { name: newName, description: newDescription },
      {
        onSuccess: () => {
          setIsOpen(false);
          setNewName('');
          setNewDescription('');
        },
      }
    );
  };

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
      {t('dashboard.addButton')}
    </DialogTrigger>
    <DialogContent className="bg-card text-card-foreground">
      <DialogHeader>
        <DialogTitle>{t('dashboard.addTroop.title')}</DialogTitle>
        <DialogDescription>
          {t('dashboard.addTroop.mainDescription')}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 my-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t('dashboard.addTroop.name.label')}</Label>
          <Input
            id="name"
            placeholder={t('dashboard.addTroop.name.placeholder')}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('dashboard.addTroop.description.label')}</Label>
          <Input
            id="description"
            placeholder={t('dashboard.addTroop.description.placeholder')}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
      </div>

      {createTroopMutation.isError && (
        <p className="text-sm text-destructive">
          {(createTroopMutation.error as Error).message}
        </p>
      )}

      <DialogFooter>
        <Button
          onClick={handleAddTroop}
          disabled={createTroopMutation.isPending}
          className="w-full"
        >
          {createTroopMutation.isPending
            ? t('dashboard.loading')
            : t('dashboard.addButton')}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}