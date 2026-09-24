import { Degree } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateDegreeDto {
  @IsEnum(Degree, { message: 'Nieprawidłowy stopień harcerski' })
  degree!: Degree;

  @IsEnum(Degree, { message: 'Nieprawidłowy stopień zdobyty' })
  acquiringDegree!: Degree;
}
