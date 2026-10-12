import { useEffect, useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Degree, DEGREE_ORDER } from "@harcapp/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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

  const values = useMemo(
    () =>
      disableAfter !== undefined
        ? DEGREE_ORDER.slice(disableAfter)
        : DEGREE_ORDER,
    [disableAfter],
  );

  useEffect(() => {
    if (values.length > 0 && !values.includes(selectedDegree)) {
      setSelectedDegree(values[0]);
    }
  }, [selectedDegree, setSelectedDegree, values]);

  return (
    <Select
      value={selectedDegree}
      onValueChange={(val) => setSelectedDegree(val as Degree)}
    >
      <SelectTrigger className="w-full overflow-hidden">
        <SelectValue placeholder={t("troopDetails.addModal.degreePlaceholder")}>
          <span className="block truncate">
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
