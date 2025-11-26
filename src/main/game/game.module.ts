import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [GameController],
  providers: [GameService,NotificationService],
})
export class GameModule {}
