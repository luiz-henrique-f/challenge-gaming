import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
// import { TaskHistoryModule } from 'src/task-history/task-history.module';
// import { TaskModule } from 'src/task/task.module';

import { TaskHistoryModule } from '../task-history/task-history.module'; // ✅ Caminho relativo
import { TaskModule } from '../task/task.module'; // ✅ Caminho relativo + nome correto
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [CommentController],
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    TaskHistoryModule,
    forwardRef(() => TaskModule),
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
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
