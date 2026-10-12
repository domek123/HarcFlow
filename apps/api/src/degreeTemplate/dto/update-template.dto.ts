import { Degree } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { UpdateTemplateTaskDto } from './update-template-tast.dto';

export class UpdateTemplateDto {
  @IsOptional()
  @IsEnum(Degree)
  degree?: Degree;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateTemplateTaskDto)
  tasks?: UpdateTemplateTaskDto[];
}
