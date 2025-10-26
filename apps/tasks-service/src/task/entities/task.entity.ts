// apps/tasks-service/src/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
// import { TaskStatus, TaskPriority } from '@repo/types';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { TaskHistoryEntity } from 'src/task-history/entities/task-history.entity';

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

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({  type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    nullable: true
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    nullable: true
  })
  status: TaskStatus;

  @Column({type: 'uuid', name: 'created_by'})
  createdBy: string;

  @Column({type: 'text', name: 'created_by_name'})
  createdByName: string;

  @Column({ type: 'simple-array', name: 'assigned_user_ids', nullable: true })
  assignedUserIds: string[];

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => CommentEntity, comment => comment.task)
  comments: CommentEntity[];

  @OneToMany(() => TaskHistoryEntity, history => history.task)
  history: TaskHistoryEntity[];
}