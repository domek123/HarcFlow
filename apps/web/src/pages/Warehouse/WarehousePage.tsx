import { useState } from "react";

import { useTranslation } from "react-i18next";

import { BadgeInventorySection } from "./Badge/BadgeInventorySection";
import { EquipmentInventorySection } from "./Inventory/EquipmentInventorySection";
import { WarehouseSectionTabs } from "./WarehouseSectionTabs";

export function WarehousePage() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<"equipment" | "badges">(
    "badges",
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("warehouse.title")}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t("warehouse.description")}
        </p>
        <WarehouseSectionTabs
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </header>

      {activeSection === "badges" ? (
        <BadgeInventorySection />
      ) : (
        <EquipmentInventorySection />
      )}
    </div>
  );
}
