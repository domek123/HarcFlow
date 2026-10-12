import { ScoutDegreeTaskStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateScoutDegreeTaskDto {
  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsEnum(ScoutDegreeTaskStatus)
  status?: ScoutDegreeTaskStatus;
}
