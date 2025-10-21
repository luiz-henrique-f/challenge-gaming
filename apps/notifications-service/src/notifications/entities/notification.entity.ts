import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({  name: 'task_id' })
  taskId: string;

  @Column({  name: 'comment_id', default: null })
  commentId: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @CreateDateColumn({  name: 'created_at' })
  createdAt: Date;
}
