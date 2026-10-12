import { Minus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEquipmentInventory } from "../hooks/useEquipmentInventory";
import { EmptyState, ErrorState, LoadingState } from "../WarehouseStates";
import { InventoryItemDialog } from "./InventoryItemDialog";
import { categoryLabelKeys } from "./warehouse.constants";

export function EquipmentInventorySection() {
  const { t } = useTranslation();
  const warehouse = useEquipmentInventory();

  return (
    <>
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>{t("warehouse.equipment.title")}</CardTitle>
            <CardDescription>
              {t("warehouse.equipment.description")}
            </CardDescription>
          </div>
          <Button onClick={warehouse.openCreate}>
            <Plus />
            {t("warehouse.equipment.add")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                value={warehouse.inventorySearch}
                onChange={(event) =>
                  warehouse.setInventorySearch(event.target.value)
                }
                placeholder={t("warehouse.equipment.searchPlaceholder")}
                className="pl-8"
              />
            </div>
            <Select
              value={warehouse.category}
              onValueChange={(value) =>
                warehouse.setCategory(value as typeof warehouse.category)
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue>
                  {t(categoryLabelKeys[warehouse.category])}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabelKeys).map(([value, labelKey]) => (
                  <SelectItem key={value} value={value}>
                    {t(labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {warehouse.inventoryQuery.isLoading ? (
            <LoadingState label={t("warehouse.equipment.loading")} />
          ) : warehouse.inventoryQuery.isError ? (
            <ErrorState onRetry={() => warehouse.inventoryQuery.refetch()} />
          ) : warehouse.visibleItems.length === 0 ? (
            <EmptyState
              title={
                warehouse.inventorySearch || warehouse.category !== "ALL"
                  ? t("warehouse.equipment.noResults")
                  : t("warehouse.equipment.empty")
              }
              description={
                warehouse.inventorySearch || warehouse.category !== "ALL"
                  ? t("warehouse.equipment.noResultsDescription")
                  : t("warehouse.equipment.emptyDescription")
              }
              action={
                !warehouse.inventorySearch && warehouse.category === "ALL" ? (
                  <Button onClick={warehouse.openCreate}>
                    <Plus />
                    {t("warehouse.equipment.addFirst")}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("warehouse.equipment.table.name")}</TableHead>
                    <TableHead>{t("warehouse.equipment.table.type")}</TableHead>
                    <TableHead className="w-44 text-center">
                      {t("warehouse.equipment.table.amount")}
                    </TableHead>
                    <TableHead className="w-28 text-right">
                      {t("warehouse.equipment.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouse.visibleItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {t(categoryLabelKeys[item.type])}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={
                              item.amount <= 0 ||
                              warehouse.incrementItem.isPending
                            }
                            onClick={() =>
                              warehouse.incrementItem.mutate({
                                itemId: item.id,
                                delta: -1,
                              })
                            }
                            aria-label={t("warehouse.equipment.decrease", {
                              name: item.name,
                            })}
                          >
                            <Minus />
                          </Button>
                          <span className="min-w-8 text-center font-semibold">
                            {item.amount}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={warehouse.incrementItem.isPending}
                            onClick={() =>
                              warehouse.incrementItem.mutate({
                                itemId: item.id,
                                delta: 1,
                              })
                            }
                            aria-label={t("warehouse.equipment.increase", {
                              name: item.name,
                            })}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => warehouse.openEdit(item)}
                            aria-label={t("warehouse.equipment.edit", {
                              name: item.name,
                            })}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => warehouse.setDeleteDialogItem(item)}
                            aria-label={t("warehouse.equipment.delete", {
                              name: item.name,
                            })}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <InventoryItemDialog
        open={warehouse.isFormOpen}
        item={warehouse.editingItem}
        isPending={
          warehouse.createItem.isPending || warehouse.updateItem.isPending
        }
        onOpenChange={(open) => {
          if (!open) warehouse.closeForm();
        }}
        onSubmit={warehouse.handleSubmitItem}
      />

      <Dialog
        open={warehouse.deleteDialogItem !== null}
        onOpenChange={(open) => {
          if (!open && !warehouse.deleteItem.isPending) {
            warehouse.setDeleteDialogItem(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("warehouse.dialog.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {warehouse.deleteDialogItem
                ? t("warehouse.dialog.deleteDescription", {
                    name: warehouse.deleteDialogItem.name,
                  })
                : t("warehouse.dialog.deleteFallbackDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => warehouse.setDeleteDialogItem(null)}
              disabled={warehouse.deleteItem.isPending}
            >
              {t("warehouse.form.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={warehouse.handleDelete}
              disabled={warehouse.deleteItem.isPending}
            >
              {warehouse.deleteItem.isPending
                ? t("common.loading")
                : t("warehouse.dialog.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
