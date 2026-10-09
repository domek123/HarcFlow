import { DEGREE_ORDER, Degree } from "@harcapp/types";
import { Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

type TemplateSelectorProps = {
  selectedDegree: Degree;
  onSelect: (degree: Degree) => void;
};

export function TemplateSelector({
  selectedDegree,
  onSelect,
}: TemplateSelectorProps) {
  const { t } = useTranslation();

  return (
    <div
      className="rounded-xl border bg-card/70 p-2 shadow-sm"
      role="radiogroup"
      aria-label={t("degreeTemplates.selectorLabel")}
    >
      <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Compass className="size-3.5 text-primary" />
        {t("degreeTemplates.selectorLabel")}
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {DEGREE_ORDER.filter((degree) => degree !== Degree.NONE).map(
          (degree) => (
            <Button
              key={degree}
              type="button"
              role="radio"
              aria-checked={selectedDegree === degree}
              variant={selectedDegree === degree ? "default" : "ghost"}
              className="min-w-max flex-1 rounded-lg px-4"
              onClick={() => onSelect(degree)}
            >
              {t(`enums.degree.${degree}`)}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
