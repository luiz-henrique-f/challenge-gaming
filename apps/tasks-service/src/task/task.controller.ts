import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';

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
  title: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigned_user_ids?: string[];
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: string[];
}

@ApiTags('Tasks Service - Microservice')
@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('task-create')
  @ApiOperation({ 
    summary: 'Criar tarefa', 
    description: 'Cria uma nova tarefa no sistema' 
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Tarefa criada com sucesso' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  async createTask(@Payload() data: { dto: CreateTaskDto; userId: string, name: string }) {
    return this.taskService.create(data.dto, data.userId, data.name);
  }

  @MessagePattern('task-update')
  @ApiOperation({ 
    summary: 'Atualizar tarefa', 
    description: 'Atualiza uma tarefa existente' 
  })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa atualizada com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async updateTask(@Payload() data: { id: string; dto: UpdateTaskDto; userId: string }) {
    return this.taskService.update(data.id, data.dto, data.userId);
  }

  @MessagePattern('task-get')
  @ApiOperation({ 
    summary: 'Buscar tarefa', 
    description: 'Busca uma tarefa específica pelo ID' 
  })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa encontrada' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async getTask(@Payload() id: string) {
    return this.taskService.getById(id);
  }

  @MessagePattern('task-list')
  @ApiOperation({ 
    summary: 'Listar tarefas', 
    description: 'Lista tarefas com filtros e paginação' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Tamanho da página' })
  @ApiQuery({ name: 'search', required: false, description: 'Termo de busca' })
  @ApiQuery({ name: 'priority', required: false, enum: TaskPriority, description: 'Filtrar por prioridade' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus, description: 'Filtrar por status' })
  @ApiQuery({ name: 'dueDateRange', required: false, description: 'Filtrar por range de data' })
  @ApiQuery({ name: 'assignedToMe', required: false, type: Boolean, description: 'Filtrar tarefas atribuídas a mim' })
  @ApiQuery({ name: 'createdByMe', required: false, type: Boolean, description: 'Filtrar tarefas criadas por mim' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarefas retornada com sucesso' 
  })
  async findAll(@Payload() data: { 
    page: number; 
    size: number; 
    userId: string;
    search?: string;
    priority?: string;
    status?: string;
    dueDateRange?: string;
    assignedToMe?: boolean;
    createdByMe?: boolean;
  }) {
    try {
      const filters = {
        page: Number(data.page) || 1,
        size: Number(data.size) || 10,
        userId: data.userId,
        ...(data.search && { search: data.search }),
        ...(data.priority && { priority: data.priority }),
        ...(data.status && { status: data.status }),
        ...(data.dueDateRange && { dueDateRange: data.dueDateRange }),
        ...(data.assignedToMe && { assignedToMe: data.assignedToMe }),
        ...(data.createdByMe && { createdByMe: data.createdByMe }),
      };

      return this.taskService.findAll(filters);
    } catch (error) {
      throw new RpcException({
        status: error.status || 500,
        message: error.message || 'Erro ao buscar tarefas',
      });
    }
  }

  @MessagePattern('task-delete')
  @ApiOperation({ 
    summary: 'Excluir tarefa', 
    description: 'Exclui uma tarefa pelo ID' 
  })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa excluída com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async deleteTask(@Payload() id: string) {
    return this.taskService.deleteById(id);
  }
}