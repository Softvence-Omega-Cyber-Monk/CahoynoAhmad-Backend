// src/quest/quest.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { QuestType } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestService {
  private readonly logger = new Logger(QuestService.name);

  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------------------------
  // DAILY QUEST → MEMORIZE 1 RANDOM AYAH
  // ----------------------------------------------------------------------
  async generateAndAssignDailyQuest(userId: string) {
    const now = new Date();
    const startOfDayUTC = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ));

    return this.prisma.$transaction(async (tx) => {
      // Check existing daily quest
      const existing = await tx.userQuest.findFirst({
        where: {
          userId,
          quest: { type: QuestType.DAILY },
          assignedAt: { gte: startOfDayUTC }
        }
      });

      if (existing) {
        return existing;
      }

      // Get random ayah
      const totalAyahs = await tx.ayah.count();
      const randomAyah = await tx.ayah.findFirst({
        skip: Math.floor(Math.random() * totalAyahs),
        select: {
          id: true,
          text: true,
          number: true,
          surahId: true
        },
      });

      if (!randomAyah) throw new Error('No Ayah found.');

      // Create quest with full ayah text
      const quest = await tx.quest.create({
        data: {
          title: `Memorize Ayah ${randomAyah.number}`,
          description: randomAyah.text, // FULL AYAH
          type: QuestType.DAILY,
          xpReward: 20,
          surahId: randomAyah.surahId,
          ayahId: randomAyah.id,
        },
      });

      // Assign to user
      return await tx.userQuest.create({
        data: {
          userId,
          questId: quest.id,
          assignedAt: new Date(),
        },
      });
    });
  }

  // ----------------------------------------------------------------------
  // WEEKLY QUEST → READ / STUDY 1 RANDOM SURAH ONLY
  // ----------------------------------------------------------------------
  async generateAndAssignWeeklyQuest(userId: string) {
    const now = new Date();
    const startOfWeekUTC = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - now.getUTCDay()
    ));

    return this.prisma.$transaction(async (tx) => {
      // Check existing weekly quest
      const existing = await tx.userQuest.findFirst({
        where: {
          userId,
          quest: { type: QuestType.WEEKLY },
          assignedAt: { gte: startOfWeekUTC }
        }
      });

      if (existing) {
        return existing;
      }

      // Pick random Surah
      const totalSurahs = await tx.surah.count();
      const randomSurah = await tx.surah.findFirst({
        skip: Math.floor(Math.random() * totalSurahs),
        select: {
          id: true,
          name: true,
          number: true
        }
      });

      if (!randomSurah) throw new Error('No Surah found.');

      // Create quest
      const quest = await tx.quest.create({
        data: {
          title: `Study Surah ${randomSurah.name}`,
          description: `Read and understand Surah ${randomSurah.name}.`,
          type: QuestType.WEEKLY,
          xpReward: 150,
          surahId: randomSurah.id,
        },
      });

      // Assign to user
      return await tx.userQuest.create({
        data: {
          userId,
          questId: quest.id,
          assignedAt: new Date(),
        },
      });
    });
  }
}
