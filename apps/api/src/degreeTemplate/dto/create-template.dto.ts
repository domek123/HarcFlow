import { Degree } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, ValidateNested } from 'class-validator';

import { CreateTemplateTaskDto } from './create-template-task.dto';

export class CreateTemplateDto {
  @IsEnum(Degree)
  degree!: Degree;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateTaskDto)
  tasks!: CreateTemplateTaskDto[];
}
