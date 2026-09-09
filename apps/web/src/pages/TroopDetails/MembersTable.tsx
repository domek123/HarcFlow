import { useState } from "react";

import { Calendar, Mail, Phone, Trash2, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberDialog } from "@/pages/TroopDetails/AddMemberModal.tsx";
import { useDeleteTroopMember } from "@harcapp/api-client";
import { type ScoutProfileDTO } from "@harcapp/types";
import type { Function as ScoutFunction } from "@harcapp/types";

const functionBadgeVariants: Record<ScoutFunction, string> = {
  DRUZYNOWY: "bg-blue-950 text-white hover:bg-blue-900",
  PRZYBOCZNY: "bg-emerald-700 text-white hover:bg-emerald-800",
  ZASTEPOWY: "bg-amber-900 text-white hover:bg-amber-950",
  PODZASTEPOWY: "bg-slate-500 text-white hover:bg-slate-600",
  NONE: "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200",
};

interface MembersTableProps {
  members: ScoutProfileDTO[];
}

export function MembersTable({ members }: MembersTableProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { mutateAsync: deleteMember } = useDeleteTroopMember(id ?? "");

  const [memberToEdit, setMemberToEdit] = useState<ScoutProfileDTO | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteMember = (id: string) => {
    toast.promise(deleteMember(id), {
      success: () => t("troopDetails.deleteMemberSuccess"),
      error: () => t("troopDetails.deleteMemberError"),
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("troopDetails.table.name")}</TableHead>
            <TableHead>{t("troopDetails.table.gender")}</TableHead>
            <TableHead>{t("troopDetails.table.birthDate")}</TableHead>
            <TableHead>{t("troopDetails.table.contact")}</TableHead>
            <TableHead>{t("troopDetails.table.function")}</TableHead>
            <TableHead>{t("troopDetails.table.rank")}</TableHead>
            <TableHead>{t("troopDetails.table.degree")}</TableHead>
            <TableHead className="text-right">
              {t("troopDetails.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.firstName} {member.lastName}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {t(`enums.gender.${member.gender}`)}
                </Badge>
              </TableCell>
              <TableCell>
                {member.birthDate ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {member.birthDate}
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-xs">
                  {member.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {member.email}
                    </div>
                  )}
                  {member.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {member.phoneNumber}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    functionBadgeVariants[member.function] ??
                    "bg-slate-500 text-white"
                  }
                >
                  {t(`enums.function.${member.function}`)}
                </Badge>
              </TableCell>
              <TableCell>{t(`enums.rank.${member.rank}`)}</TableCell>
              <TableCell>{t(`enums.degree.${member.degree}`)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => {
                    setMemberToEdit(member);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {members.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-6 text-muted-foreground"
              >
                {t("troopDetails.table.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <MemberDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        memberToEdit={memberToEdit}
      />
    </div>
  );
}
