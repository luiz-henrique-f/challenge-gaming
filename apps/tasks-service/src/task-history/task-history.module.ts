import { Module } from '@nestjs/common';
import { TaskHistoryService } from './task-history.service';
import { TaskHistoryController } from './task-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskHistoryEntity } from './entities/task-history.entity';

@Module({
  controllers: [TaskHistoryController],
      imports: [TypeOrmModule.forFeature([TaskHistoryEntity])],
  providers: [TaskHistoryService],
  exports: [TaskHistoryService]
})
export class TaskHistoryModule {}
