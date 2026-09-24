import { Award, ClipboardCheck, MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MemberActionsMenuProps = {
  onDegreeClick: () => void;
};

export function MemberActionsMenu({ onDegreeClick }: MemberActionsMenuProps) {
  const { t } = useTranslation();

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("ranksAndSkills.actions.open")}
              title={t("ranksAndSkills.actions.open")}
            />
          }
        >
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <ClipboardCheck className="size-4" />
            {t("ranksAndSkills.actions.trial")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDegreeClick}>
            <Award className="size-4" />
            {t("ranksAndSkills.actions.degree")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
