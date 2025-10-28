import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  // cria a instância HTTP (necessária para socket.io e Swagger)
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  // conecta ao RabbitMQ como microserviço
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@rabbitmq:5672'],
      queue: 'notifications_queue',
      queueOptions: { durable: true },
    },
  });

  // Configurações globais
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuração do Swagger
  setupSwagger(app);

  // inicia ambos
  await app.startAllMicroservices();
  await app.listen(3004);

  Logger.log('🔔 Notifications Service is running');
  Logger.log('📚 Swagger: http://localhost:3004/api/docs');
  Logger.log('🔌 RabbitMQ: notifications_queue');
  Logger.log('🌐 WebSocket: ws://localhost:3004');
}
bootstrap();