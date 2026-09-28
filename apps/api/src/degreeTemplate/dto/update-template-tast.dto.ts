import { IsOptional, IsUUID } from 'class-validator';
import { CreateTemplateTaskDto } from './create-template-task.dto';

export class UpdateTemplateTaskDto extends CreateTemplateTaskDto {
  @IsOptional()
  @IsUUID()
  id?: string;
}
