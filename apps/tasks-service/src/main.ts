import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  // Mude para criar uma aplicação HTTP + Microservice
  const app = await NestFactory.create(AppModule);

  // Conecta ao RabbitMQ como microserviço
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@rabbitmq:5672'],
      queue: 'tasks_queue',
      queueOptions: { durable: false },
    },
  });

  // Configurações globais
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuração do Swagger
  setupSwagger(app);

  // Inicia o microservice
  await app.startAllMicroservices();
  
  // Inicia o servidor HTTP na porta 3003
  await app.listen(3003);

  Logger.log('✅ Tasks Service is running');
  Logger.log('📚 Swagger: http://localhost:3003/api/docs');
  Logger.log('🔌 RabbitMQ: tasks_queue');
}
bootstrap();