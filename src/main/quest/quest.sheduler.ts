// import { Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';

// import { PrismaService } from 'src/prisma/prisma.service';
// import { QuestService } from './questService';

// @Injectable()
// export class QuestScheduler {
//   private readonly logger = new Logger(QuestScheduler.name);

//   constructor(
//     private readonly questService: QuestService,
//     private readonly prisma: PrismaService
//   ) {}

//   // Assign daily quests at 00:00 every day
//   @Cron('0 0 * * *')
//   async assignDailyQuests() {
//     this.logger.log('Assigning daily quests to all users...');
//     const users = await this.prisma.credential.findMany();
//     for (const user of users) {
//       try {
//         await this.questService.generateAndAssignDailyQuest(user.id);
//       } catch (err) {
//         this.logger.error(`Failed daily quest for user ${user.id}: ${err.message}`);
//       }
//     }
//   }

//   // Assign weekly quests at 00:00 every Sunday
//   @Cron('0 0 * * 0')
//   async assignWeeklyQuests() {
//     this.logger.log('Assigning weekly quests to all users...');
//     const users = await this.prisma.credential.findMany();
//     for (const user of users) {
//       try {
//         await this.questService.generateAndAssignWeeklyQuest(user.id);
//       } catch (err) {
//         this.logger.error(`Failed weekly quest for user ${user.id}: ${err.message}`);
//       }
//     }
//   }
// }
