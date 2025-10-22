import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // endereço do seu frontend Vite
    credentials: true, // permite envio de cookies ou headers de auth
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
