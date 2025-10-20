// apps/tasks-service/src/entities/task-history.entity.ts
import { TaskEntity } from 'src/task/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('task_history')
export class TaskHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'uuid', name: 'task_id'})
  taskId: string;

  @Column({type: 'uuid', name: 'user_id'})
  userId: string; // ID do usuário que fez a alteração

  @Column()
  action: string; // 'created', 'updated', 'status_changed', 'assigned'

  @Column({ type: 'jsonb', nullable: true, name: 'old_values'})
  oldValues: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, name: 'new_values'})
  newValues: Record<string, any>;

  @Column('text')
  description: string; // Descrição legível da alteração

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  // Relacionamentos
  @ManyToOne(() => TaskEntity, task => task.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}