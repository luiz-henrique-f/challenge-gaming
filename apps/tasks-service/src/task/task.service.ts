import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TaskHistoryService } from '../task-history/task-history.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '@repo/types';

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

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = this.taskRepository.create({
        ...createTaskDto,
        createdBy: userId,
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

  async findAll(filters: any): Promise<{ tasks: TaskEntity[]; total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: filters,
      order: { createdAt: 'DESC' },
      skip: (filters.page - 1) * filters.size,
      take: filters.size,
    });

    return { tasks, total };
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