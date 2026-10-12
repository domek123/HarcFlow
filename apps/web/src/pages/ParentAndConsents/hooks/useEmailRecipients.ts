import { useMemo, useState } from "react";

import { normalizeEmail } from "../utils";

import type { EmailMode, ParentContact } from "../types";

export function useEmailRecipients(parentsWithEmail: ParentContact[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<EmailMode>("bcc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const selectedParents = useMemo(
    () => parentsWithEmail.filter((parent) => selectedIds.includes(parent.id)),
    [parentsWithEmail, selectedIds],
  );
  const emails = useMemo(
    () =>
      Array.from(
        new Set(
          selectedParents
            .map((parent) => normalizeEmail(parent.email))
            .filter((email): email is string => email !== null),
        ),
      ),
    [selectedParents],
  );

  function open() {
    setSelectedIds(parentsWithEmail.map((parent) => parent.id));
    setMode("bcc");
    setCopySuccess(false);
    setIsOpen(true);
  }

  function toggle(parentId: string, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? current.includes(parentId)
          ? current
          : [...current, parentId]
        : current.filter((id) => id !== parentId),
    );
  }

  function toggleAll(ids: string[], checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? Array.from(new Set([...current, ...ids]))
        : current.filter((id) => !ids.includes(id)),
    );
  }

  async function copy() {
    const recipients = emails.join(", ");
    if (!recipients) return;
    try {
      await navigator.clipboard.writeText(recipients);
      setCopySuccess(true);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = recipients;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      setCopySuccess(document.execCommand("copy"));
      document.body.removeChild(textArea);
    }
  }

  function openEmailClient() {
    if (!emails.length) return;

    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      [mode === "bcc" ? "bcc" : "to"]: emails.join(","),
    });

    window.open(`https://mail.google.com/mail/u/0/?${params}`, "_blank");
  }

  return {
    isOpen,
    setIsOpen,
    mode,
    setMode,
    selectedIds,
    selectedCount: selectedParents.length,
    emails,
    copySuccess,
    open,
    toggle,
    toggleAll,
    copy,
    openEmailClient,
  };
}
