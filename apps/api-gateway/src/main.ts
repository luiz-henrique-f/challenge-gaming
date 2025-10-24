import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não definidos no DTO
      forbidNonWhitelisted: true, // lança erro se receber campo não esperado
      transform: true, // transforma o body na instância da classe DTO
    }),
  );
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
