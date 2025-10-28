import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate, IsEnum, IsArray, MaxLength, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

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
  @ApiPropertyOptional({
    example: 'Implementar sistema de autenticação JWT',
    description: 'Novo título da tarefa',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Título muito longo. Informe até 255 caracteres.' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Implementar JWT authentication com refresh token e validação de permissões',
    description: 'Nova descrição da tarefa',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Descrição muito longa. Informe até 1000 caracteres.' })
  description?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Nova data limite para conclusão (formato ISO 8601)',
    format: 'date-time'
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deadline?: Date;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: 'Nova prioridade da tarefa'
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Prioridade inválida' })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'Novo status da tarefa'
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status inválido' })
  status?: TaskStatus;
  
  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Novos IDs dos usuários atribuídos à tarefa',
    type: [String],
    format: 'uuid'
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Cada ID de usuário deve ser um UUID válido' })
  assignedUserIds?: string[];
}