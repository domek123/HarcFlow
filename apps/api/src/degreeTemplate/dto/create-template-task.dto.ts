import { IsString } from 'class-validator';

export class CreateTemplateTaskDto {
  @IsString()
  description!: string;
}
