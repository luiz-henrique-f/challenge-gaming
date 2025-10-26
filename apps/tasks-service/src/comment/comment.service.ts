// apps/tasks-service/src/comments/comments.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TaskService } from 'src/task/task.service';
import { CommentEntity } from './entities/comment.entity';
// import { CreateCommentDto, UpdateCommentDto } from '@repo/types';
import { ClientProxy, RpcException } from '@nestjs/microservices';

export class CreateCommentDto {
  content: string;
}

export class UpdateCommentDto {
  content: string;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private tasksService: TaskService,
    private dataSource: DataSource,
    @Inject('NOTIFICATIONS-SERVICE')
    private readonly notificationsClient: ClientProxy
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
      const task = await this.tasksService.findById(taskId);
      if (!task) {
        throw new RpcException({ status: 404, message: 'Tarefa não encontrada' });
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

      this.notificationsClient.emit('task.comment.created', {
        type: 'task.comment.created',
        taskId,
        commentId: savedComment.id,
        content: savedComment.content,
        userId: user.id,
        userEmail: user.username,
        userName: user.name,
        assignedUserIds: task.assignedUserIds,
        title: task.title,
      });

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
        throw new RpcException({ status: 404, message: 'Comentário não encontrado' });
      }
      
      if (comment.userId !== userId) {
        throw new RpcException({ status: 404, message: 'Você só pode atualizar seus próprios comentários.' });
      }

      Object.assign(comment, updateCommentDto);
      
      const savedComment = await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();

      // TODO: Atualizar para 'task.comment.updated' quando implementado
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

  async findAllByTaskId(
    taskId: string, 
    page: number = 1, 
    size: number = 10
  ) {
    // Verifica se a task existe
    const task = await this.tasksService.findById(taskId);
    if (!task) {
      throw new RpcException({ status: 404, message: 'Tarefa não encontrada' });
    }

    // Calcula o offset
    const skip = (page - 1) * size;

    // Busca os comentários com paginação
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { taskId },
      order: { createdAt: 'ASC' }, // Ordem crescente para chat
      skip,
      take: size,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        userName: true,
        userEmail: true,
        taskId: true,
      },
    });

    // Calcula o total de páginas
    const totalPages = Math.ceil(total / size);

    return {
      comments,
      total,
      page,
      size,
      totalPages,
    };
  }

  async findById(id: string): Promise<CommentEntity | null> {
    return this.commentRepository.findOne({ where: { id } });
  }
}