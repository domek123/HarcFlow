import { Gender, Rank, Degree, Function } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsDateString()
  birthDate!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsUUID()
  troopId!: string;

  @IsEnum(Rank)
  rank!: Rank;

  @IsEnum(Degree)
  degree!: Degree;

  @IsEnum(Function)
  function!: Function;

  @IsOptional()
  @IsUUID()
  patrolId?: string;
}
