// apps/notifications-service/src/config/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Serviço de autenticação e autorização')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Operações de autenticação e autorização')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}