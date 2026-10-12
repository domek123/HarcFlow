import { Minus, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useBadgeInventory } from "../hooks/useBadgeInventory";
import { EmptyState, ErrorState, LoadingState } from "../WarehouseStates";

export function BadgeInventorySection() {
  const { t } = useTranslation();
  const warehouse = useBadgeInventory();

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle>{t("warehouse.badges.title")}</CardTitle>
          <CardDescription>{t("warehouse.badges.description")}</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            value={warehouse.badgeSearch}
            onChange={(event) => warehouse.setBadgeSearch(event.target.value)}
            placeholder={t("warehouse.badges.searchPlaceholder")}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {warehouse.badgeQuery.isLoading ? (
          <LoadingState label={t("warehouse.badges.loading")} />
        ) : warehouse.badgeQuery.isError ? (
          <ErrorState onRetry={() => warehouse.badgeQuery.refetch()} />
        ) : warehouse.badgeGroups.length === 0 ? (
          <EmptyState
            title={
              warehouse.badgeSearch
                ? t("warehouse.badges.noResults")
                : t("warehouse.badges.empty")
            }
            description={
              warehouse.badgeSearch
                ? t("warehouse.badges.noResultsDescription")
                : t("warehouse.badges.emptyDescription")
            }
          />
        ) : (
          <div className="space-y-6">
            {warehouse.badgeGroups.map(([category, badges]) => (
              <section key={category}>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  {category}
                </h3>
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("warehouse.badges.table.name")}
                        </TableHead>
                        <TableHead className="w-32 text-center">
                          {t("warehouse.badges.table.level")}
                        </TableHead>
                        <TableHead className="w-48 text-right">
                          {t("warehouse.badges.table.available")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {badges.map((badge) => (
                        <TableRow key={badge.id}>
                          <TableCell className="font-medium">
                            {badge.name}
                          </TableCell>
                          <TableCell className="text-center text-amber-600">
                            {badge.level
                              ? `${"★".repeat(badge.level)}${"☆".repeat(3 - badge.level)}`
                              : "M"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                disabled={
                                  badge.quantity <= 0 ||
                                  warehouse.updateBadgeQuantity.isPending
                                }
                                onClick={() =>
                                  warehouse.updateBadgeQuantity.mutate({
                                    troopId: warehouse.troopId!,
                                    badgeId: badge.id,
                                    delta: -1,
                                  })
                                }
                                aria-label={t("warehouse.badges.decrease", {
                                  name: badge.name,
                                })}
                              >
                                <Minus />
                              </Button>
                              <span className="min-w-8 text-center font-semibold">
                                {badge.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                disabled={
                                  warehouse.updateBadgeQuantity.isPending
                                }
                                onClick={() =>
                                  warehouse.updateBadgeQuantity.mutate({
                                    troopId: warehouse.troopId!,
                                    badgeId: badge.id,
                                    delta: 1,
                                  })
                                }
                                aria-label={t("warehouse.badges.increase", {
                                  name: badge.name,
                                })}
                              >
                                <Plus />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
