import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './app/auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksController } from './app/tasks/tasks.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH-SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-service', //'127.0.0.1',
          port: 3002,
        }
      },
      {
        name: 'TASKS-SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'tasks-service',//'127.0.0.1',
          port: 3003,
        }
      }
    ])
  ],
  controllers: [AppController, AuthController, TasksController],
  providers: [AppService],
})
export class AppModule {}
