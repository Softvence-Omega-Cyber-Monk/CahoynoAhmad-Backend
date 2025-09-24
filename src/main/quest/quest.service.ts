import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestService } from './questService';


@Injectable()
export class QuestSchedulerService {
  private readonly logger = new Logger(QuestSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly questService: QuestService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyQuestCron() {
    this.logger.log('Starting daily quest assignment for all users...');
    await this.assignQuestsToAllUsers('DAILY');
    this.logger.log('Daily quest assignment complete.');
  }

  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyQuestCron() {
    this.logger.log('Starting weekly quest assignment for all users...');
    await this.assignQuestsToAllUsers('WEEKLY');
    this.logger.log('Weekly quest assignment complete.');
  }

  private async assignQuestsToAllUsers(questType: 'DAILY' | 'WEEKLY') {
    const users = await this.prisma.credential.findMany({ select: { id: true } });
    if (users.length === 0) {
      this.logger.log('No users found to assign quests to.');
      return;
    }
    
    for (const user of users) {
      if (questType === 'DAILY') {
        await this.questService.generateAndAssignDailyQuest(user.id);
      } else {
        await this.questService.generateAndAssignWeeklyQuest(user.id);
      }
    }
  }
}
