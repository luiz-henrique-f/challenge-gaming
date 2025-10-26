import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TaskService } from './task.service';
// import { CreateTaskDto, UpdateTaskDto } from '@repo/types';

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


@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('task-create')
  async createTask(@Payload() data: { dto: CreateTaskDto; userId: string, name: string }) {
    return this.taskService.create(data.dto, data.userId, data.name);
  }

  @MessagePattern('task-update')
  async updateTask(@Payload() data: { id: string; dto: UpdateTaskDto; userId: string }) {
    return this.taskService.update(data.id, data.dto, data.userId);
  }

  @MessagePattern('task-get')
  async getTask(@Payload() id: string) {
    return this.taskService.getById(id);
  }

  @MessagePattern('task-list')
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
  async deleteTask(@Payload() id: string) {
    return this.taskService.deleteById(id);
  }

  // @MessagePattern('comment.create')
  // async addComment(@Payload() data: { taskId: string; content: string; user: any }) {
  //   return this.taskService.addComment(data.taskId, data.content, data.user);
  // }

  // @MessagePattern('comment.list')
  // async getComments(@Payload() taskId: string) {
  //   return this.taskService.getComments(taskId);
  // }

  // @MessagePattern('task.history')
  // async getTaskHistory(@Payload() taskId: string) {
  //   return this.taskService.getTaskHistory(taskId);
  // }
}