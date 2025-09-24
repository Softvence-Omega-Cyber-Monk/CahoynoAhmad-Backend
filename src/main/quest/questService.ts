// src/quest/quest.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { QuestType } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestService {
  private readonly logger = new Logger(QuestService.name);

  constructor(private prisma: PrismaService) {}

  async generateAndAssignDailyQuest(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingQuest = await this.prisma.userQuest.findFirst({
      where: {
        userId,
        quest: { type: QuestType.DAILY },
        assignedAt: { gte: today },
      },
    });

    if (existingQuest) {
      this.logger.log(`User ${userId} already has a daily quest for today.`);
      return existingQuest;
    }
    
    const totalGameData = await this.prisma.gameData.count();
    if (totalGameData === 0) {
      this.logger.warn('No game data found to create a daily quest from.');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * totalGameData);
    
    const randomGameData = await this.prisma.gameData.findMany({
      take: 1,
      skip: randomIndex,
      select: { surahId: true, ayahId: true, arabicText: true }
    });
    
    if (randomGameData.length === 0 || !randomGameData[0].surahId || !randomGameData[0].ayahId) {
      this.logger.warn('Failed to find a valid ayah for the daily quest.');
      return null;
    }
    
    const selectedAyah = randomGameData[0];
    const surahNumber = selectedAyah.surahId;
    const ayahNumber = selectedAyah.ayahId;
    const arabicText = selectedAyah.arabicText;

    const newQuest = await this.prisma.quest.create({
      data: {
        title: "Memorize this Ayah",
        description: `Recite and memorize Surah ${surahNumber}, Ayah ${ayahNumber}: "${arabicText?.substring(0, 50) || 'N/A'}..."`,
        xpReward: 20,
        type: QuestType.DAILY,
        surahId: surahNumber,
        ayahId: ayahNumber,
      },
    });

    const assignedQuest = await this.prisma.userQuest.create({
      data: {
        userId,
        questId: newQuest.id,
      },
    });
    
    this.logger.log(`Assigned new daily quest to user ${userId}: "${newQuest.title}"`);
    return assignedQuest;
  }

  async generateAndAssignWeeklyQuest(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); 
    const existingQuest = await this.prisma.userQuest.findFirst({
      where: {
        userId,
        quest: { type: QuestType.WEEKLY },
        assignedAt: { gte: startOfWeek },
      },
    });

    if (existingQuest) {
      this.logger.log(`User ${userId} already has a weekly quest for this week.`);
      return existingQuest;
    }

    const questGenerators = [
      async () => { // Type 1: Answer a specific number of questions correctly
        const count = 50 + Math.floor(Math.random() * 50);
        return {
          title: `Answer ${count} Correct Questions`,
          description: `Get ${count} correct answers this week.`,
          xpReward: 100,
          targetCount: count,
        };
      },
      async () => { // Type 2: Complete a specific number of surahs
        const count = 3 + Math.floor(Math.random() * 3);
        return {
          title: `Complete ${count} Surahs`,
          description: `Successfully complete ${count} full surahs this week.`,
          xpReward: 150,
          targetCount: count,
        };
      },
      async () => { // Type 3: Complete a single, specific challenging surah
        const totalSurahs = await this.prisma.surah.count();
        if (totalSurahs === 0) throw new Error('No surah found for quest.');
        const randomIndex = Math.floor(Math.random() * totalSurahs);
        const randomSurah = await this.prisma.surah.findMany({
            take: 1,
            skip: randomIndex,
            select: { id: true, name: true }
        });
        
        if (randomSurah.length === 0) throw new Error('No surah found for quest.');

        return {
          title: `Master Surah ${randomSurah[0].name}`,
          description: `Complete all questions for Surah ${randomSurah[0].name} this week.`,
          xpReward: 250,
          targetSurah: randomSurah[0].id,
        };
      },
      async () => { // Type 4: Answer questions from a specific Juz
        const randomJuz = 1 + Math.floor(Math.random() * 30);
        const count = 10 + Math.floor(Math.random() * 10);
        return {
          title: `Answer ${count} questions from Juz ${randomJuz}`,
          description: `Correctly answer ${count} questions from Juz ${randomJuz} this week.`,
          xpReward: 200,
          targetCount: count,
          targetJuz: randomJuz,
        };
      },
    ];

    const randomGenerator = questGenerators[Math.floor(Math.random() * questGenerators.length)];
    const questData = await randomGenerator();

    const newQuest = await this.prisma.quest.create({
      data: {
        ...questData,
        type: QuestType.WEEKLY,
      },
    });

    const assignedQuest = await this.prisma.userQuest.create({
      data: {
        userId,
        questId: newQuest.id,
      },
    });
    
    this.logger.log(`Assigned new weekly quest to user ${userId}: "${newQuest.title}"`);
    return assignedQuest;
  }
}