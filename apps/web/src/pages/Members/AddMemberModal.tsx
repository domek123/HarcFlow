import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { DegreeSelect } from "@/components/DegreeSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddMember, useUpdateTroopMember } from "@harcapp/api-client";
import {
  Degree,
  Function,
  Gender,
  Rank,
  type Function as ScoutFunction,
  type ScoutProfileDTO,
} from "@harcapp/types";
import {
  addMemberDefaultValues,
  createAddMemberSchema,
  type AddMemberFormValues,
} from "@harcapp/validators";

interface MemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memberToEdit?: ScoutProfileDTO | null;
}

export function MemberDialog({
  isOpen,
  onOpenChange,
  memberToEdit,
}: MemberDialogProps) {
  const { t } = useTranslation();
  const { id: troopId } = useParams<{ id: string }>();

  const isEditMode = Boolean(memberToEdit);

  const { mutateAsync: addMember } = useAddMember(troopId ?? "");
  const { mutateAsync: updateMember } = useUpdateTroopMember(troopId ?? "");

  const memberSchema = createAddMemberSchema(t);

  const {
    register,
    watch,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: addMemberDefaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (memberToEdit) {
        reset({
          firstName: memberToEdit.firstName || "",
          lastName: memberToEdit.lastName || "",
          email: memberToEdit.email || "",
          phoneNumber: memberToEdit.phoneNumber || "",
          birthDate: memberToEdit.birthDate
            ? memberToEdit.birthDate.split("T")[0]
            : undefined,
          gender: memberToEdit.gender || Gender.MALE,
          function: memberToEdit.function || Function.NONE,
          rank: memberToEdit.rank || Rank.NONE,
          degree: memberToEdit.degree || Degree.NONE,
        });
      } else {
        reset(addMemberDefaultValues);
      }
    }
  }, [isOpen, memberToEdit, reset]);

  const selectedGender = watch("gender");
  const selectedFunction = watch("function");
  const selectedRank = watch("rank");
  const selectedDegree = watch("degree");

  const onSubmit = async (values: Omit<ScoutProfileDTO, "id" | "userId">) => {
    const savePromise =
      isEditMode && memberToEdit
        ? updateMember({ id: memberToEdit.id, ...values })
        : addMember(values);

    toast.promise(savePromise, {
      loading: t("common.saving"),
      success: () => {
        reset();
        onOpenChange(false);
        return isEditMode
          ? t("troopDetails.editModal.success")
          : t("troopDetails.addModal.success");
      },
      error: () => {
        return isEditMode
          ? t("troopDetails.editModal.error")
          : t("troopDetails.addModal.error");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? t("troopDetails.editModal.title")
                : t("troopDetails.addModal.title")}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? t("troopDetails.editModal.description")
                : t("troopDetails.addModal.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Imię i Nazwisko */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  {t("troopDetails.addModal.firstName")}
                </Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  {t("troopDetails.addModal.lastName")}
                </Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email i Telefon */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  {t("troopDetails.addModal.email")}
                </Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">
                  {t("troopDetails.addModal.phoneNumber")}
                </Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
                {errors.phoneNumber && (
                  <p className="text-xs text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Data Urodzenia i Płeć */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthDate">
                  {t("troopDetails.addModal.birthDate")}
                </Label>
                <Input id="birthDate" type="date" {...register("birthDate")} />
                {errors.birthDate && (
                  <p className="text-xs text-destructive">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">
                  {t("troopDetails.addModal.gender")}
                </Label>
                <Select
                  value={selectedGender}
                  onValueChange={(val) =>
                    setValue("gender", val as "MALE" | "FEMALE", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {t(`enums.gender.${selectedGender}`, selectedGender)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">
                      {t("enums.gender.MALE")}
                    </SelectItem>
                    <SelectItem value="FEMALE">
                      {t("enums.gender.FEMALE")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Funkcja, Rank, Degree */}
            <div className="grid grid-cols-3 gap-2 w-full">
              {/* FUNKCJA */}
              <div className="grid gap-2 min-w-0">
                <Label htmlFor="function">
                  {t("troopDetails.addModal.function")}
                </Label>
                <Select
                  value={selectedFunction}
                  onValueChange={(val) =>
                    setValue("function", val as ScoutFunction, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="function" className="w-full">
                    <SelectValue
                      placeholder={t(
                        "troopDetails.addModal.functionPlaceholder",
                      )}
                    >
                      <span className="truncate block">
                        {t(
                          `enums.function.${selectedFunction}`,
                          selectedFunction,
                        )}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Function.NONE}>
                      {t("enums.function.NONE")}
                    </SelectItem>
                    <SelectItem value={Function.PODZASTEPOWY}>
                      {t("enums.function.PODZASTEPOWY")}
                    </SelectItem>
                    <SelectItem value={Function.ZASTEPOWY}>
                      {t("enums.function.ZASTEPOWY")}
                    </SelectItem>
                    <SelectItem value={Function.PRZYBOCZNY}>
                      {t("enums.function.PRZYBOCZNY")}
                    </SelectItem>
                    <SelectItem value={Function.DRUZYNOWY}>
                      {t("enums.function.DRUZYNOWY")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* RANK */}
              <div className="grid gap-2 min-w-0">
                <Label htmlFor="rank">{t("troopDetails.addModal.rank")}</Label>
                <Select
                  value={selectedRank}
                  onValueChange={(val) =>
                    setValue("rank", val as Rank, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="rank" className="w-full">
                    <SelectValue
                      placeholder={t("troopDetails.addModal.rankPlaceholder")}
                    >
                      <span className="truncate block">
                        {t(`enums.rank.${selectedRank}`, selectedRank)}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Rank.NONE}>
                      {t("enums.rank.NONE")}
                    </SelectItem>
                    <SelectItem value={Rank.PRZEWODNIK}>
                      {t("enums.rank.PRZEWODNIK")}
                    </SelectItem>
                    <SelectItem value={Rank.PODHARCMISTRZ}>
                      {t("enums.rank.PODHARCMISTRZ")}
                    </SelectItem>
                    <SelectItem value={Rank.HARCMISTRZ}>
                      {t("enums.rank.HARCMISTRZ")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* DEGREE */}
              <div className="grid gap-2 min-w-0">
                <Label htmlFor="degree">
                  {t("troopDetails.addModal.degree")}
                </Label>
                <DegreeSelect
                  selectedDegree={selectedDegree}
                  setSelectedDegree={(val) =>
                    setValue("degree", val as Degree, { shouldValidate: true })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("troopDetails.addModal.cancel")}
            </Button>
            <Button type="submit">
              {isEditMode
                ? t("troopDetails.editModal.save")
                : t("troopDetails.addModal.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
