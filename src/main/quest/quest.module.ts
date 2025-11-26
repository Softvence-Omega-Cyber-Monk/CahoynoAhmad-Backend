// src/quest/quest.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestService } from './questService';
import { QuestSchedulerService } from './quest.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';


@Module({
  imports: [PrismaModule,ScheduleModule.forRoot()],
  providers: [QuestService, QuestSchedulerService,NotificationService],
  exports: [QuestService],
})
export class QuestModule {}