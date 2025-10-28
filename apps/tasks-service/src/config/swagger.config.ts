import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Tasks Service')
    .setDescription('Serviço de gerenciamento de tarefas')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('tasks', 'Operações de tarefas')
    .addTag('comments', 'Operações de comentários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}