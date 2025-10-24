import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '@repo/types';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'Título muito longo. Informe até 255 caracteres.' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assigned_user_ids?: string[];
}