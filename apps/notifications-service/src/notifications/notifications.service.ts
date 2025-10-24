import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly gateway: NotificationsGateway,
  ) {}
  
  async handleEvent(event: any) {
    console.log('Processing event in NotificationsService:', event);
    const notifications = event.assignedUserIds.map((userId: string) =>
    this.notificationRepository.create({
      type: event.type,
      taskId: event.taskId,
      userId,
      content: this.getMessage(event),
      commentId: event.commentId || null,
        }),
    );

    const savedNotifications = await this.notificationRepository.save(notifications);

    savedNotifications.forEach((notif) => {
      console.log('Sending notification to user:', notif.userId, 'Content:', notif.content);
    this.gateway.notifyUser(notif.userId, notif);
  });

  console.log(`Notifications created for event: ${event.type} for ${savedNotifications.length} users`);
  }

  private getMessage(event: any) {
    switch (event.type) {
    case 'task.created':
      return `Nova tarefa atribuída: ${event.title}`;

    case 'task.updated':
      if (event.changes && event.changes.length > 1) {
        return `A tarefa ${event.title} teve atualizações`;
      } else if (event.changes === 'status') {
        return `A tarefa ${event.title} teve seu status alterado`;
      } else if (event.changes === 'priority') {
        return `A tarefa ${event.title} teve sua prioridade alterada`;
      } else {
        return `A tarefa ${event.title} foi atualizada`;
      }

    case 'task.comment.created':
      return `Novo comentário na tarefa ${event.title}: "${event.content}" por ${event.userName}`;

    default:
      return 'Atualização recebida.';
  }
  }
}