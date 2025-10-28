import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications Service - Microservice')
@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('task.created')
  @ApiOperation({ 
    summary: 'Notificar criação de tarefa', 
    description: 'Processa evento de criação de tarefa para notificação' 
  })
  async handleTaskCreated(event: any) {
    this.logger.log('📩 Recebido evento task.created:');
    await this.notificationsService.handleEvent(event);
  }

  @EventPattern('task.updated')
  @ApiOperation({ 
    summary: 'Notificar atualização de tarefa', 
    description: 'Processa evento de atualização de tarefa para notificação' 
  })
  async handleTaskUpdated(event: any) {
    this.logger.log('📩 Recebido evento task.updated:');
    await this.notificationsService.handleEvent(event);
  }

  @EventPattern('task.comment.created')
  @ApiOperation({ 
    summary: 'Notificar criação de comentário', 
    description: 'Processa evento de criação de comentário para notificação' 
  })
  async handleCommentedCreated(event: any) {
    this.logger.log('📩 Recebido evento task.comment.created:');
    await this.notificationsService.handleEvent(event);
  }
}