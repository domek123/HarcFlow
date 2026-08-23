import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddMember } from "@harcapp/api";
import type {
  Degree,
  Rank,
  Function as ScoutFunction,
  ScoutProfileDTO,
} from "@harcapp/types";
import { createAddMemberSchema, type AddMemberFormValues } from "@harcapp/validators";


export const AddMemberDialog = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const {mutateAsync: addMember} = useAddMember(id);

  const memberSchema = createAddMemberSchema(t);

  const {register, watch, formState:{errors}, setValue, reset, handleSubmit} = useForm<AddMemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birthDate: '',
      gender: 'MALE',
      function: 'NONE',
      rank: 'NONE',
      degree: 'NONE',
    },
  });

  const selectedGender = watch("gender");
  const selectedFunction = watch("function");
  const selectedRank = watch("rank");
  const selectedDegree = watch("degree");

  const onSubmit = async (values: Omit<ScoutProfileDTO, "id">) => {
    await addMember(values);
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) reset();
    }}>
      <DialogTrigger className={buttonVariants()}>
        <UserPlus className="mr-2 h-4 w-4" />
        {t('troopDetails.addModal.trigger')}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{t('troopDetails.addModal.title')}</DialogTitle>
            <DialogDescription>
              {t('troopDetails.addModal.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Imię i Nazwisko */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t('troopDetails.addModal.firstName')}</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t('troopDetails.addModal.lastName')}</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email i Telefon */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('troopDetails.addModal.email')}</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">{t('troopDetails.addModal.phoneNumber')}</Label>
                <Input id="phoneNumber" {...register('phoneNumber')} />
                {errors.phoneNumber && (
                  <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            {/* Data Urodzenia i Płeć */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthDate">{t('troopDetails.addModal.birthDate')}</Label>
                <Input id="birthDate" type="date" {...register('birthDate')} />
                {errors.birthDate && (
                  <p className="text-xs text-destructive">{errors.birthDate.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">{t('troopDetails.addModal.gender')}</Label>
                <Select
                  value={selectedGender}
                  onValueChange={(val) => setValue("gender", val as "MALE" | "FEMALE", { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {t(`enums.gender.${selectedGender}`, selectedGender)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">{t('enums.gender.MALE')}</SelectItem>
                    <SelectItem value="FEMALE">{t('enums.gender.FEMALE')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-destructive">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Funkcja, Rank, Degree */}
            <div className="grid grid-cols-3 gap-2 w-full">
              {/* FUNKCJA */}
              <div className="grid gap-2 min-w-0">
                <Label htmlFor="function">{t('troopDetails.addModal.function')}</Label>
                <Select
                  value={selectedFunction}
                  onValueChange={(val) => setValue("function", val as ScoutFunction, { shouldValidate: true })}
                >
                  <SelectTrigger id="function" className="w-full">
                    <SelectValue placeholder={t('troopDetails.addModal.functionPlaceholder')}>
                      <span className="truncate block">
                        {t(`enums.function.${selectedFunction}`, selectedFunction)}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">{t('enums.function.NONE')}</SelectItem>
                    <SelectItem value="DRUZYNOWY">{t('enums.function.DRUZYNOWY')}</SelectItem>
                    <SelectItem value="PRZYBOCZNY">{t('enums.function.PRZYBOCZNY')}</SelectItem>
                    <SelectItem value="ZASTEPOWY">{t('enums.function.ZASTEPOWY')}</SelectItem>
                    <SelectItem value="PODZASTEPOWY">{t('enums.function.PODZASTEPOWY')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* RANK */}
              <div className="grid gap-2 min-w-0">
                <Label htmlFor="rank">{t('troopDetails.addModal.rank')}</Label>
                <Select
                  value={selectedRank}
                  onValueChange={(val) => setValue("rank", val as Rank, { shouldValidate: true })}
                >
                  <SelectTrigger id="rank" className="w-full">
                    <SelectValue placeholder={t('troopDetails.addModal.rankPlaceholder')}>
                      <span className="truncate block">
                        {t(`enums.rank.${selectedRank}`, selectedRank)}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">{t('enums.rank.NONE')}</SelectItem>
                    <SelectItem value="PRZEWODNIK">{t('enums.rank.PRZEWODNIK')}</SelectItem>
                    <SelectItem value="PODHARCMISTRZ">{t('enums.rank.PODHARCMISTRZ')}</SelectItem>
                    <SelectItem value="HARCMISTRZ">{t('enums.rank.HARCMISTRZ')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* DEGREE */}
              <div className="grid gap-2 min-w-0">
                <Label htmlFor="degree">{t('troopDetails.addModal.degree')}</Label>
                <Select
                  value={selectedDegree}
                  onValueChange={(val) => setValue("degree", val as Degree, { shouldValidate: true })}
                >
                  <SelectTrigger id="degree" className="w-full overflow-hidden">
                    <SelectValue placeholder={t('troopDetails.addModal.degreePlaceholder')}>
                      <span className="truncate block">
                        {t(`enums.degree.${selectedDegree}`, selectedDegree)}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">{t('enums.degree.NONE')}</SelectItem>
                    <SelectItem value="DH">{t('enums.degree.DH')}</SelectItem>
                    <SelectItem value="ML">{t('enums.degree.ML')}</SelectItem>
                    <SelectItem value="WYW">{t('enums.degree.WYW')}</SelectItem>
                    <SelectItem value="CW">{t('enums.degree.CW')}</SelectItem>
                    <SelectItem value="HO">{t('enums.degree.HO')}</SelectItem>
                    <SelectItem value="HR">{t('enums.degree.HR')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t('troopDetails.addModal.cancel')}
            </Button>
            <Button type="submit">{t('troopDetails.addModal.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};