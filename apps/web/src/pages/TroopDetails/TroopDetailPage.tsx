import React, { useState } from "react";

import { ArrowLeft, Pencil, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTroopMembers } from "@/hooks/useTroopMembers";
import { supabase } from "@/lib/supabase.ts";
import { MemberDialog } from "@/pages/TroopDetails/AddMemberModal.tsx";
import { MembersTable } from "@/pages/TroopDetails/MembersTable.tsx";
import { useTroopDetails } from "@harcapp/api-client";

import { EditTroopModal } from "./EditTroopModal";

export const TroopDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data: troop, isLoading } = useTroopDetails(supabase, id);

  const { members, totalCount, search, setSearch, sortBy, setSortBy } =
    useTroopMembers(id);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEditTroopModalOpen, setIsEditTroopModalOpen] = useState(false);

  if (isLoading || !troop) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
      <Button variant="ghost" className="mb-2">
        <Link to="/dashboard" className="inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("troopDetails.backToList")}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-3xl font-bold">
                  {troop.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsEditTroopModalOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-base mt-2">
                {troop.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {t("troopDetails.foundedYear", { year: troop.creationYear })}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <EditTroopModal
        isOpen={isEditTroopModalOpen}
        onOpenChange={setIsEditTroopModalOpen}
        troop={troop}
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">
                {t("troopDetails.membersTitle")}
              </CardTitle>
              <CardDescription>
                {t("troopDetails.totalCount", { count: totalCount })}
              </CardDescription>
            </div>
            <Button onClick={() => setIsMemberModalOpen(true)}>
              {t("troopDetails.addModal.trigger")}
            </Button>
            <MemberDialog
              isOpen={isMemberModalOpen}
              onOpenChange={setIsMemberModalOpen}
              memberToEdit={null}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("troopDetails.searchPlaceholder")}
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-auto">
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val ?? "none")}
              >
                <SelectTrigger className="w-full sm:w-55 sm:ml-auto">
                  <SelectValue>
                    {sortBy && t(`troopDetails.sortBy.${sortBy}`)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t("troopDetails.sortBy.none")}
                  </SelectItem>
                  <SelectItem value="function">
                    {t("troopDetails.sortBy.function")}
                  </SelectItem>
                  <SelectItem value="rank">
                    {t("troopDetails.sortBy.rank")}
                  </SelectItem>
                  <SelectItem value="degree">
                    {t("troopDetails.sortBy.degree")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <MembersTable members={members} />
        </CardContent>
      </Card>
    </div>
  );
};
