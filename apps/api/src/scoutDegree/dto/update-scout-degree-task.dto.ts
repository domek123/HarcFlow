import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ScoutDegreeTaskStatus } from '@prisma/client';

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
