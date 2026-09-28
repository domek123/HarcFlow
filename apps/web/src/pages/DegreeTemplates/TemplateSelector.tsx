import { DEGREE_ORDER, Degree } from "@harcapp/types";
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
      className="flex gap-2 overflow-x-auto pb-2"
      role="radiogroup"
      aria-label={t("degreeTemplates.selectorLabel")}
    >
      {DEGREE_ORDER.filter((degree) => degree !== Degree.NONE).map((degree) => (
        <Button
          key={degree}
          type="button"
          role="radio"
          aria-checked={selectedDegree === degree}
          variant={selectedDegree === degree ? "default" : "outline"}
          className="min-w-max rounded-90 flex-1"
          onClick={() => onSelect(degree)}
        >
          {t(`enums.degree.${degree}`)}
        </Button>
      ))}
    </div>
  );
}
