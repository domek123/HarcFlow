import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Degree, DEGREE_ORDER } from "@harcapp/types";
import { useEffect } from "react";

type DegreeSelectProps = {
  selectedDegree: Degree;
  setSelectedDegree: (degree: Degree | null) => void;
  disableAfter?: number;
};

export function DegreeSelect({
  selectedDegree,
  setSelectedDegree,
  disableAfter,
}: DegreeSelectProps) {
  const { t } = useTranslation();

  let values = DEGREE_ORDER;

  if (disableAfter !== undefined) {
    values = values.slice(disableAfter);
  }

  useEffect(() => {
    if (!values.includes(selectedDegree)) {
      setSelectedDegree(values[0]);
    }
  }, [selectedDegree]);

  return (
    <Select
      value={selectedDegree}
      onValueChange={(val) => setSelectedDegree(val)}
    >
      <SelectTrigger className="w-full overflow-hidden">
        <SelectValue placeholder={t("troopDetails.addModal.degreePlaceholder")}>
          <span className="truncate block">
            {t(`enums.degree.${selectedDegree}`, selectedDegree)}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {values.map((degree) => (
          <SelectItem value={degree} key={degree}>
            {t(`enums.degree.${degree}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
