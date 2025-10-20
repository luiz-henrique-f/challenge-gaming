// apps/tasks-service/src/comments/comments.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { TaskHistoryService } from '../task-history/task-history.service';
// import { ClientProxy } from '@nestjs/microservices';
import { TaskService } from 'src/task/task.service';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '@repo/types';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private tasksService: TaskService,
    private taskHistoryService: TaskHistoryService,
    private dataSource: DataSource,
    // @Inject('RABBITMQ_CLIENT') private rabbitmqClient: ClientProxy,
  ) {}

  async create(
    taskId: string, 
    createCommentDto: CreateCommentDto, 
    user: { id: string; username: string; name: string }
  ): Promise<CommentEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar se a task existe
      const task = await this.tasksService.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const comment = this.commentRepository.create({
        ...createCommentDto,
        taskId,
        userId: user.id,
        userEmail: user.username,
        userName: user.name,
      });

      const savedComment = await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();

      // Publicar evento
      // this.rabbitmqClient.emit('task.comment.created', {
      //   taskId,
      //   commentId: savedComment.id,
      //   content: savedComment.content,
      //   userId: user.id,
      //   userEmail: user.email,
      //   userName: user.name,
      //   assignedUserIds: task.assignedUserIds,
      // });

      return savedComment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<CommentEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment = await this.findById(id);
      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.userId !== userId) {
        throw new Error('You can only update your own comments');
      }

      Object.assign(comment, updateCommentDto);
      
      const savedComment = await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();

      // Publicar evento
      // this.rabbitmqClient.emit('task.comment.updated', {
      //   taskId: comment.taskId,
      //   commentId: savedComment.id,
      //   content: savedComment.content,
      //   userId: user.id,
      //   userEmail: user.email,
      //   userName: user.name,
      // });

      return savedComment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByTaskId(taskId: string): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: { taskId },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<CommentEntity | null> {
    return this.commentRepository.findOne({ where: { id } });
  }
}