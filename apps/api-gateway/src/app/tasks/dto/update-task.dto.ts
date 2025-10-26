import { IsOptional, IsString, IsDate, IsEnum, IsArray, IsMongoId, MaxLength, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
// import { TaskStatus, TaskPriority } from '@repo/types';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Título muito longo. Informe até 255 caracteres.' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deadline?: Date;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
  
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assignedUserIds?: string[];
}