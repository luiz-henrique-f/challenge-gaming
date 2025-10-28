import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Notifications Service')
    .setDescription('Serviço de notificações em tempo real via WebSocket')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('notifications', 'Operações de notificações')
    .addTag('websocket', 'Eventos WebSocket')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}