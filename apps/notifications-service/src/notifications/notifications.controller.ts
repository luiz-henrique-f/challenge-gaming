import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('task.created')
  async handleTaskCreated(event: any) {
    this.logger.log('📩 Recebido evento task.created:');
    await this.notificationsService.handleEvent(event);
  }

  @EventPattern('task.updated')
  async handleTaskUpdated(event: any) {
    this.logger.log('📩 Recebido evento task.updated:');
    await this.notificationsService.handleEvent(event);
  }

  @EventPattern('task.comment.created')
  async handleCommentedCreated(event: any) {
    this.logger.log('📩 Recebido evento task.comment.created:');
    await this.notificationsService.handleEvent(event);
  }
}
