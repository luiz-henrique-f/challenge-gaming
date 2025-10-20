// apps/tasks-service/src/entities/comment.entity.ts
import { TaskEntity } from 'src/task/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Task } from './task.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({type: 'uuid', name: 'user_id'})
  userId: string; // ID do usuário que comentou

  @Column({name: 'user_email'})
  userEmail: string; // Email do usuário (para exibição)

  @Column({name: 'user_name'})
  userName: string; // Nome do usuário (para exibição)

  @Column({type: 'uuid', name: 'task_id'})
  taskId: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @CreateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => TaskEntity, task => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}