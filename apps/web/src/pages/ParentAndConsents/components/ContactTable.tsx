import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ChildContact } from "../types";

export function ContactTable({
  contacts,
  emptyMessage,
}: {
  contacts: ChildContact[];
  emptyMessage: string;
}) {
  const { t } = useTranslation();
  if (!contacts.length)
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">{t("contacts.table.name")}</TableHead>
            <TableHead className="w-1/2">{t("contacts.table.email")}</TableHead>
            <TableHead>{t("contacts.table.phone")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                {contact.firstName} {contact.lastName}
              </TableCell>
              <TableCell>
                {contact.email ? (
                  <a
                    className="text-primary hover:underline"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-muted-foreground">
                    {t("contacts.noEmail")}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {contact.phoneNumber || (
                  <span className="text-muted-foreground">
                    {t("contacts.noPhone")}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
