import { Award, Boxes } from "lucide-react";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WarehouseSection = "equipment" | "badges";

type WarehouseSectionTabsProps = {
  activeSection: WarehouseSection;
  onSectionChange: (section: WarehouseSection) => void;
};

export function WarehouseSectionTabs({
  activeSection,
  onSectionChange,
}: WarehouseSectionTabsProps) {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("warehouse.sections.label")}
      className="flex flex-wrap gap-2 pt-3"
    >
      <button
        type="button"
        onClick={() => onSectionChange("badges")}
        className={cn(
          buttonVariants({
            variant: activeSection === "badges" ? "default" : "outline",
            size: "sm",
          }),
        )}
        aria-pressed={activeSection === "badges"}
      >
        <Award />
        {t("warehouse.sections.badges")}
      </button>
      <button
        type="button"
        onClick={() => onSectionChange("equipment")}
        className={cn(
          buttonVariants({
            variant: activeSection === "equipment" ? "default" : "outline",
            size: "sm",
          }),
        )}
        aria-pressed={activeSection === "equipment"}
      >
        <Boxes />
        {t("warehouse.sections.equipment")}
      </button>
    </nav>
  );
}
