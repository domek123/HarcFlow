import { IsUUID } from 'class-validator';

export class CreateScoutDegreeDto {
  @IsUUID()
  templateId!: string;
}
