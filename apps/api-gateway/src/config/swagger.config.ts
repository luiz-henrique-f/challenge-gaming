import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway - Central de todas as APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Operações de autenticação')
    .addTag('tasks', 'Operações de tarefas')
    .addTag('notifications', 'Operações de notificações')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}