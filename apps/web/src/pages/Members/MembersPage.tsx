import { useState } from "react";

import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTroopMembers } from "@/hooks/useTroopMembers";
import { MemberDialog } from "./AddMemberModal";
import { MembersTable } from "./MembersTable";

export function MembersPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { members, totalCount, search, setSearch, sortBy, setSortBy } =
    useTroopMembers(id);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
          <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("troopDetails.searchPlaceholder")}
                className="pl-8"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value ?? "none")}
              >
                <SelectTrigger className="w-full sm:ml-auto sm:w-55">
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
}
