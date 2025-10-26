import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { CommentModule } from 'src/comment/comment.module';
import { TaskHistoryModule } from 'src/task-history/task-history.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [TaskController],
    imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    forwardRef(() => CommentModule),
    TaskHistoryModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@rabbitmq:5672'],
          queue: 'notifications_queue',
          queueOptions: { durable: true },
        },
      },
    ])
  ],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}
