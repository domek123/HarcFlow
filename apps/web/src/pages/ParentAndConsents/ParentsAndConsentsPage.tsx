import { Mail, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ContactTable } from "./components/ContactTable";
import { EmailRecipientsDialog } from "./components/EmailRecipientsDialog";
import { useContactsPage } from "./hooks/useContactsPage";
import { useEmailRecipients } from "./hooks/useEmailRecipients";

export default function ParentsAndConsentsPage() {
  const { t } = useTranslation();
  const contacts = useContactsPage();
  const email = useEmailRecipients(contacts.parentsWithEmail);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("contacts.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("contacts.description")}
          </p>
        </div>
        <Button onClick={email.open}>
          <Mail className="mr-2 h-4 w-4" />
          {t("contacts.generateEmail")}
        </Button>
      </div>

      {contacts.error && (
        <Alert variant="destructive">
          <AlertDescription>{t("contacts.loadError")}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={contacts.search}
          onChange={(event) => contacts.setSearch(event.target.value)}
          placeholder={t("contacts.searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {t("contacts.children", { count: contacts.children.length })}
        </h2>
        {contacts.isLoading ? (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            {t("contacts.loading")}
          </div>
        ) : (
          <ContactTable
            contacts={contacts.filteredChildren}
            emptyMessage={t("contacts.emptyChildren")}
          />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {t("contacts.parents", { count: contacts.parents.length })}
        </h2>
        {contacts.isLoading ? (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            {t("contacts.loading")}
          </div>
        ) : (
          <ContactTable
            contacts={contacts.filteredParents}
            emptyMessage={t("contacts.emptyParents")}
          />
        )}
      </section>

      <EmailRecipientsDialog
        parents={contacts.parentsWithEmail}
        isOpen={email.isOpen}
        onOpenChange={email.setIsOpen}
        mode={email.mode}
        onModeChange={email.setMode}
        selectedIds={email.selectedIds}
        selectedCount={email.selectedCount}
        emails={email.emails}
        copySuccess={email.copySuccess}
        onToggle={email.toggle}
        onToggleAll={email.toggleAll}
        onCopy={() => void email.copy()}
        onOpenEmailClient={email.openEmailClient}
      />
    </div>
  );
}
