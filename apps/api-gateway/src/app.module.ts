import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './app/auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksController } from './app/tasks/tasks.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'AUTH-SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-service',
          port: 3002,
        }
      },
      {
        name: 'TASKS-SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'tasks-service',
          port: 3003,
        }
      }
    ]),
    // ✅ Configuração direta e funcional
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,     // 1 minuto
        limit: 10,      // 10 requisições por minuto
      },
    ]),
  ],
  controllers: [AppController, AuthController, TasksController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}