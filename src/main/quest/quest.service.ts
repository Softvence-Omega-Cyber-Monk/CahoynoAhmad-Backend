import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestService } from './questService';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class QuestSchedulerService {
  private readonly logger = new Logger(QuestSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly questService: QuestService,
    private readonly notification:NotificationService
  ) {}

  // TESTING MODE → Runs every day
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async handleDailyQuestCron() {
  this.logger.log('Running DAILY quest test cron...');
  await this.assignQuestsToAllUsers('DAILY');
  await this.notification.broadcastToAll({
    title: 'Tugas Harianmu Telah Diberikan',
    body: 'Tugas harian baru sudah tersedia.'
  });
}


  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyQuestCron() {
    this.logger.log('Running WEEKLY quest test cron...');
    await this.assignQuestsToAllUsers('WEEKLY');
   
  }

  //*assing dailyQuest
  private async assignQuestsToAllUsers(questType: 'DAILY' | 'WEEKLY') {
    const users = await this.prisma.credential.findMany({ select: { id: true } });

    if (users.length === 0) return;

    for (const user of users) {
      if (questType === 'DAILY') {
        await this.questService.generateAndAssignDailyQuest(user.id);
      } else {
        await this.questService.generateAndAssignWeeklyQuest(user.id);
      }
    }
  }
}
