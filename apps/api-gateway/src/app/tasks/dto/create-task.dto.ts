import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implementar sistema de autenticação',
    description: 'Título da tarefa',
    maxLength: 255
  })
  @IsNotEmpty({ message: 'O título da tarefa é obrigatório' })
  @IsString()
  @MaxLength(255, { message: 'Título muito longo. Informe até 255 caracteres.' })
  title: string;

  @ApiPropertyOptional({
    example: 'Implementar JWT authentication com refresh token',
    description: 'Descrição detalhada da tarefa',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Descrição muito longa. Informe até 1000 caracteres.' })
  description?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Data limite para conclusão da tarefa (formato ISO 8601)',
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Formato de data inválido. Use o formato ISO 8601.' })
  deadline?: string;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    description: 'Prioridade da tarefa',
    default: TaskPriority.MEDIUM
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Prioridade inválida' })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Status atual da tarefa',
    default: TaskStatus.TODO
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status inválido' })
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
    description: 'IDs dos usuários atribuídos à tarefa',
    type: [String],
    format: 'uuid'
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Cada ID de usuário deve ser um UUID válido' })
  assignedUserIds?: string[];
}