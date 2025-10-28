import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  // Cria uma aplicação HTTP normal
  const app = await NestFactory.create(AppModule);

  // Conecta como microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@rabbitmq:5672'],
      queue: 'auth_queue',
      queueOptions: { durable: false },
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  
  // Agora sim pode usar o Swagger
  setupSwagger(app);

  // Inicia o microservice
  await app.startAllMicroservices();

  // Inicia o servidor HTTP na porta 3001
  await app.listen(3001);

  Logger.log('Auth Service is running on HTTP port 3001 and RabbitMQ');
  Logger.log('Swagger documentation available at http://localhost:3001/api/docs');
}
bootstrap();