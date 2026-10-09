import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateScoutDegreeTaskDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
