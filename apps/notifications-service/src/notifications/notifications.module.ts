import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  // controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
