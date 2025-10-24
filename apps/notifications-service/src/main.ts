import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // cria a instância HTTP (necessária para socket.io)
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  // conecta ao RabbitMQ como microserviço
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: 'notifications_queue',
      queueOptions: { durable: true },
    },
  });

  // inicia ambos
  await app.startAllMicroservices();
  await app.listen(3004); // agora o socket.io pode escutar nesta porta

  console.log('Notifications service running on port 3004');
}
bootstrap();
