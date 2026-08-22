import { useState } from 'react';

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useTroops, useCreateTroop } from '@harcapp/api';
import type { TroopDTO } from '@harcapp/types';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const { data: troops, isLoading, isError, error } = useTroops(supabase);

  const createTroopMutation = useCreateTroop(supabase);

  const handleAddTroop = () => {
    if (!newName.trim()) return;

    createTroopMutation.mutate(
      { name: newName, description: newDescription },
      {
        onSuccess: () => {
          // Resetujemy formularz i zamykamy modal (cache odświeża się automatycznie!)
          setIsOpen(false);
          setNewName('');
          setNewDescription('');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Nagłówek i Przycisk Dodawania */}
        <div className="flex justify-between items-center border-b border-border pb-5">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {t('dashboard.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.description')}
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

              {/* Obsługa błędu podczas dodawania */}
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
        </div>

        {/* Sekcja stanu ładowania i błędów pobierania */}
        {isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            {t('dashboard.loadingTroops')}
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-destructive">
            {t('dashboard.errorLoadingTroops', { message: (error as Error).message })}
          </div>
        )}

        {/* Siatka Kart Drużyn */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!troops || troops.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {t('dashboard.noTroops')}
              </div>
            ) : (
              troops.map((troop: TroopDTO) => (
                <Card key={troop.id} className="flex flex-col justify-between border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{troop.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {troop.description || t('dashboard.noDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-2.5 rounded-md">
                      <span>{t('dashboard.members', { count: troop.memberCount ?? 0 })}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => console.log(`Szczegóły dla ${troop.name}`)}
                    >
                      {t('dashboard.viewDetails')}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
