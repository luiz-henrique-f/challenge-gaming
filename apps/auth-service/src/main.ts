import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
     {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@rabbitmq:5672'],
        queue: 'auth_queue',
        queueOptions: { durable: false },
    },
  },
    // {
    //   transport: Transport.TCP,
    //   options: {
    //     host: '0.0.0.0',//'127.0.0.1',
    //     port: 3002,
    //   }
    // }
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();

  Logger.log('API Gateway microservice is listening on TCP port 3002');
}
bootstrap();