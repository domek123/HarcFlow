import { IsString, MinLength } from 'class-validator';

export class CompleteScoutDegreeDto {
  @IsString()
  @MinLength(1)
  orderNumber!: string;
}
