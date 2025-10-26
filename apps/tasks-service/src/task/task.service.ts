import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TaskHistoryService } from '../task-history/task-history.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { TaskEntity } from './entities/task.entity';
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

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private taskHistoryService: TaskHistoryService,
    private dataSource: DataSource,
    @Inject('NOTIFICATIONS-SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string, name: string): Promise<TaskEntity> {
    if (createTaskDto.deadline && new Date(createTaskDto.deadline) < new Date()) {
      throw new RpcException({ status: 404, message: 'A data de prazo não pode ser menor que a data e hora atual.' });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = this.taskRepository.create({
        ...createTaskDto,
        createdBy: userId,
        createdByName: name,
      });

    const savedTask = await queryRunner.manager.save(task);

    await this.taskHistoryService.create(
        {
          taskId: savedTask.id,
          userId,
          action: 'created',
          description: `Tarefa "${savedTask.title}" criada`,
          newValues: savedTask,
        },
        queryRunner.manager
      );

      await queryRunner.commitTransaction();

      console.log(`Emitting task.created event: ${savedTask}`)

      this.notificationsClient.emit('task.created', {
        type: 'task.created',
        taskId: savedTask.id,
        title: savedTask.title,
        assignedUserIds: savedTask.assignedUserIds,
        createdBy: userId,
      });

      return savedTask;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
  }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskEntity> {
    if (updateTaskDto.deadline && new Date(updateTaskDto.deadline) < new Date()) {
      throw new RpcException({ status: 404, message: 'A data de prazo não pode ser menor que a data e hora atual.' });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = await this.findById(id);
      if (!task) {
        throw new RpcException({ status: 404, message: 'Tarefa não encontrada' });
      }

      const oldValues = { ...task };
      Object.assign(task, updateTaskDto);
      const savedTask = await queryRunner.manager.save(task);

      const changes = this.getChanges(oldValues, savedTask);
      if (changes.length > 0) {
        await this.taskHistoryService.create(
          {
            taskId: id,
            userId,
            action: 'updated',
            description: `Tarefa atualizada: ${changes.join(', ')}`,
            oldValues,
            newValues: savedTask,
          },
          queryRunner.manager
        );
      }

      await queryRunner.commitTransaction();

      console.log(`Emitting task.created event: ${savedTask}`)

      this.notificationsClient.emit('task.updated', {
        type: 'task.updated',
        taskId: savedTask.id,
        title: savedTask.title,
        assignedUserIds: savedTask.assignedUserIds,
        updatedBy: userId,
        changes: changes
      });

      return savedTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } 
  }

  async findById(id: string): Promise<TaskEntity | null> {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
  }

  async getById(id: string): Promise<TaskEntity | null> {
    return this.taskRepository.findOne({
      where: { id }
    });
  }

  async deleteById(id: string) {
    return this.taskRepository.delete({ id });
  }

  async findAll(filters: { 
  page?: number; 
  size?: number; 
  userId: string;
  search?: string;
  priority?: string;
  status?: string;
  dueDateRange?: string;
  assignedToMe?: boolean;
  createdByMe?: boolean;
}): Promise<{ 
  tasks: TaskEntity[]; 
  total: number; 
  totalPages: number; 
}> {
  const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
  const size = Number(filters.size) > 0 ? Number(filters.size) : 10;

  // Cria o query builder
  const queryBuilder = this.taskRepository.createQueryBuilder('task');

  // 🔹 Filtro de busca (título ou descrição)
  if (filters.search) {
    queryBuilder.andWhere(
      '(task.title ILIKE :search OR task.description ILIKE :search)',
      { search: `%${filters.search}%` }
    );
  }

  // 🔹 Filtro de prioridade
  if (filters.priority) {
    queryBuilder.andWhere('task.priority = :priority', { 
      priority: filters.priority 
    });
  }

  // 🔹 Filtro de status
  if (filters.status) {
    queryBuilder.andWhere('task.status = :status', { 
      status: filters.status 
    });
  }

  // 🔹 Filtro de prazo
  if (filters.dueDateRange) {
    const today = new Date();
    
    if (filters.dueDateRange === 'expired') {
      // Tarefas vencidas
      queryBuilder.andWhere('task.deadline < :today', { today });
    } else if (filters.dueDateRange === 'no_due_date') {
      // Tarefas sem prazo
      queryBuilder.andWhere('task.deadline IS NULL');
    } else {
      // Tarefas que vencem em X dias
      const days = parseInt(filters.dueDateRange);
      if (!isNaN(days)) {
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + days);
        
        queryBuilder.andWhere(
          'task.deadline BETWEEN :today AND :targetDate', 
          { today, targetDate }
        );
      }
    }
  }

  // 🔹 Filtro "Atribuídos para mim"
  if (filters.assignedToMe) {
  // 🔹 Para campo texto com UUIDs separados por vírgula
    queryBuilder.andWhere("task.assignedUserIds LIKE :userId", { 
      userId: `%${filters.userId}%` 
    });
  }

  // 🔹 Filtro "Criados por mim"
  if (filters.createdByMe) {
    queryBuilder.andWhere('task.created_by = :userId', { 
      userId: filters.userId 
    });
  }

  // Ordenação e paginação
  queryBuilder.orderBy('task.createdAt', 'DESC')
             .skip((page - 1) * size)
             .take(size);

  const [tasks, total] = await queryBuilder.getManyAndCount();
  const totalPages = Math.ceil(total / size);

  return {
    tasks,
    total,
    totalPages,
  };
}

  private getChanges(oldTask: TaskEntity, newTask: TaskEntity): string[] {
    const changes: string[] = [];
    const fields: (keyof TaskEntity)[] = ['title', 'description', 'deadline', 'priority', 'status', 'assignedUserIds'];

    fields.forEach(field => {
      if (JSON.stringify(oldTask[field]) !== JSON.stringify(newTask[field])) {
        changes.push(field);
      }
    });

    return changes;
  }
}