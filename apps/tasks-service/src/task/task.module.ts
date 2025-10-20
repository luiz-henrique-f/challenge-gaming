import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { CommentModule } from 'src/comment/comment.module';
import { TaskHistoryModule } from 'src/task-history/task-history.module';

@Module({
  controllers: [TaskController],
    imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    forwardRef(() => CommentModule),
    TaskHistoryModule,
  ],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}
