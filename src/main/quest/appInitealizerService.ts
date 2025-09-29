import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestService } from './questService';


@Injectable()
export class AppInitializerService implements OnModuleInit {
  private readonly logger = new Logger(AppInitializerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly questService: QuestService,
  ) { }

  async onModuleInit() {
    this.logger.log('Application initialized. Assigning quests to all users...');
    try {
      const users = await this.prisma.credential.findMany({ select: { id: true } });
      this.logger.log(`Found ${users.length} users to assign quests to.`);

      for (const user of users) {
        await this.questService.generateAndAssignDailyQuest(user.id);
        await this.questService.generateAndAssignWeeklyQuest(user.id);
      }
      this.logger.log('Quest assignment complete for all users.');
    } catch (error) {
      this.logger.error('Failed to assign quests on startup.', error.stack);
    }
  }
}
