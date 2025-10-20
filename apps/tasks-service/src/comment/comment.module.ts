import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
// import { TaskHistoryModule } from 'src/task-history/task-history.module';
// import { TaskModule } from 'src/task/task.module';

import { TaskHistoryModule } from '../task-history/task-history.module'; // ✅ Caminho relativo
import { TaskModule } from '../task/task.module'; // ✅ Caminho relativo + nome correto

@Module({
  controllers: [CommentController],
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    TaskHistoryModule,
    forwardRef(() => TaskModule),
  ],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
