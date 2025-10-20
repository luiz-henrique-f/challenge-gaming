// apps/tasks-service/src/task-history/task-history.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { TaskHistoryEntity } from './entities/task-history.entity';
import { CreateTaskHistoryDto } from '@repo/types';
// import { TaskHistory } from './entities/task-history.entity';

@Injectable()
export class TaskHistoryService {
  constructor(
    @InjectRepository(TaskHistoryEntity)
    private historyRepository: Repository<TaskHistoryEntity>,
  ) {}

  async create(data: CreateTaskHistoryDto, manager?: EntityManager) {
  const repo = manager ? manager.getRepository(TaskHistoryEntity) : this.historyRepository;
  const history = repo.create(data);
  return repo.save(history);
}

  async findByTaskId(taskId: string): Promise<TaskHistoryEntity[]> {
    return this.historyRepository.find({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });
  }
}