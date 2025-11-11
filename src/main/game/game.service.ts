// src/game/game.service.ts
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestStatus, QuestType } from 'generated/prisma';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {

    const isExistSurah=await this.prisma.surah.findFirst({
      where:{
        id:createGameDto.surahId
      }
    })
      const isExistAyah=await this.prisma.surah.findFirst({
      where:{
        id:createGameDto.ayahId
      }
    })
    if(!isExistSurah){
      throw new ForbiddenException("Surah not found please check  you surah id or seed the quran in your data base and try again")
    }
    if(!isExistAyah){
      throw new ForbiddenException("Ayah not found please check your ayah id seed your quran in your data and try again")
    }
    return this.prisma.gameData.create({
      data: {
        surahId: createGameDto.surahId ?? null,
        ayahId: createGameDto.ayahId ?? null,
        arabicText: createGameDto.arabicText,
        indonesianText: createGameDto.indonesianText,
        audioUrl: createGameDto.audioUrl ?? null,
        correctIndonesian: createGameDto.correct,
        optionsIndonesian: createGameDto.optionsIndonesian,
        correctArabic: createGameDto.correctArabic,
        optionsArabic: createGameDto.optionsArabic,
        correctEnglish: createGameDto.correctEnglish,
        optionsEnglish: createGameDto.optionsEnglish,
      },
    });
  }
  
  async findAll() {
    return this.prisma.gameData.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const gameWithId=await this.prisma.gameData.findFirst({
      where:{
        id:id
      }
    })
    
    if (!gameWithId) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    const game = await this.prisma.gameData.findUnique({
      where: { id },
    });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    const game = await this.prisma.gameData.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    return this.prisma.gameData.update({
      where: { id },
      data: {
        surahId: updateGameDto.surahId ?? null,
        ayahId: updateGameDto.ayahId ?? null,
        arabicText: updateGameDto.arabicText,
        indonesianText: updateGameDto.indonesianText,
        audioUrl: updateGameDto.audioUrl ?? null,
        correctIndonesian: updateGameDto.correct,
        optionsIndonesian: updateGameDto.optionsIndonesian,
        correctArabic: updateGameDto.correctArabic,
        optionsArabic: updateGameDto.optionsArabic,
        correctEnglish: updateGameDto.correctEnglish,
        optionsEnglish: updateGameDto.optionsEnglish,
      },
    });
  }

  async remove(id: string) {
    const game = await this.prisma.gameData.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    await this.prisma.gameData.delete({
      where: { id },
    });
    return{
      message:`Game question with id ${id} has been deleted successfully`
    }
  }
  
 async submitAnswer(userId: string, gameId: string, answer: string) {
  // 1️ Fetch the question with related Surah & Juz
  const game = await this.prisma.gameData.findUnique({
    where: { id: gameId },
    include: {
      surah: {
        include: { juz: true },
      },
    },
  });

  if (!game) {
    throw new NotFoundException(`Game question with ID ${gameId} not found`);
  }

  // 2️⃣ Fetch or create the user's progress for this Surah
  let progress = await this.prisma.userGameProgress.findFirst({
    where: { userId, surahId: game.surahId! },
  });

  if (progress?.completed) {
    throw new ForbiddenException('You have already completed this Surah.');
  }

  // 3️⃣ Normalize and check correctness (Arabic or main correct value)
  const normalize = (s?: string) => (s ?? '').trim().toLowerCase();
  const isCorrect =
    normalize(answer) === normalize(game.correctIndonesian) ||
    normalize(answer) === normalize(game.correctArabic) ||
    normalize(answer) === normalize(game.correctEnglish);

  // 4️⃣ Find existing answer for this question
  const existingAnswer = await this.prisma.userAnswer.findFirst({
    where: { userId, gameId },
  });

  let scoreIncrement = 0;

  // 5️⃣ Calculate score increment logic
  if (!existingAnswer) {
    if (isCorrect) scoreIncrement = 1; // first correct answer
  } else if (!existingAnswer.isCorrect && isCorrect) {
    scoreIncrement = 1; // user fixed wrong to correct
  }

  // 6️⃣ Create or update user's answer record
  if (existingAnswer) {
    await this.prisma.userAnswer.update({
      where: { id: existingAnswer.id },
      data: { isCorrect, answeredAt: new Date() },
    });
  } else {
    await this.prisma.userAnswer.create({
      data: { userId, gameId, isCorrect, answeredAt: new Date() },
    });
  }

  // 7️ Update or create progress
  if (!progress) {
    progress = await this.prisma.userGameProgress.create({
      data: {
        userId,
        surahId: game.surahId!,
        score: scoreIncrement,
        completed: false,
      },
    });
  } else if (scoreIncrement > 0) {
    progress = await this.prisma.userGameProgress.update({
      where: { id: progress.id },
      data: { score: { increment: scoreIncrement } },
    });
  }

  // 8️ Count total questions in the Surah
  const totalQuestions = await this.prisma.gameData.count({
    where: { surahId: game.surahId },
  });

  // 9️ Check if Surah is completed
  let completedSurah = false;

  const updatedProgress = await this.prisma.userGameProgress.findUnique({
    where: { id: progress.id },
  });

  if (updatedProgress && updatedProgress.score! >= totalQuestions) {
    if (!updatedProgress.completed) {
      completedSurah = true;

      await this.prisma.userGameProgress.update({
        where: { id: updatedProgress.id },
        data: { completed: true },
      });
      // 🪙 Reward XP
      await this.prisma.credential.update({
        where: { id: userId },
        data: { totalXP: { increment: 20 } },
      });

      // 🏆 Complete daily quest
      await this.completeDailyQuest(userId, game.surahId!, game.ayahId!);
    } else {
      completedSurah = true;
    }
  }

  // 🔁 Check and complete weekly quests
  await this.checkAndCompleteWeeklyQuests(
    userId,
    isCorrect,
    completedSurah,
    game.surahId!,
    game.surah?.juzId
  );

  // 🔚 Return result
  return {
    isCorrect,
    answeredCount: updatedProgress?.score ?? 0,
    totalQuestions,
    completed: completedSurah,
  };
}

  
  async completeDailyQuest(userId: string, surahId: any, ayahId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userQuest = await this.prisma.userQuest.findFirst({
      where: {
        userId,
        status: QuestStatus.IN_PROGRESS,
        quest: {
          type: QuestType.DAILY,
          surahId: surahId,
          ayahId: ayahId,
        },
        assignedAt: { gte: today },
      },
      include: { quest: true },
    });

    if (userQuest) {
      return this.completeQuest(userQuest.id);
    }
  }

  async checkAndCompleteWeeklyQuests(
    userId: string,
    isCorrect: boolean,
    surahCompleted: boolean,
    surahId?:any,
    juzId?: any,
  ) {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const userQuest = await this.prisma.userQuest.findFirst({
      where: {
        userId,
        status: QuestStatus.IN_PROGRESS,
        quest: { type: QuestType.WEEKLY },
        assignedAt: { gte: startOfWeek },
      },
      include: { quest: true },
    });

    if (!userQuest) return;

    // 1. Logic for 'Answer X Correct Questions' quest
    if (userQuest.quest.targetCount && isCorrect && !userQuest.quest.targetSurah && !userQuest.quest.targetJuz) {
      const answersThisWeek = await this.prisma.userAnswer.count({
        where: { userId, isCorrect: true, answeredAt: { gte: startOfWeek } },
      });
      if (answersThisWeek >= userQuest.quest.targetCount) {
        await this.completeQuest(userQuest.id);
      }
    }

    // 2. Logic for 'Complete X Surahs' quest
    if (userQuest.quest.targetCount && surahCompleted && !userQuest.quest.targetSurah) {
      const surahsCompletedThisWeek = await this.prisma.userGameProgress.count({
        where: { userId, completed: true, playedAt: { gte: startOfWeek } },
      });
      if (surahsCompletedThisWeek >= userQuest.quest.targetCount) {
        await this.completeQuest(userQuest.id);
      }
    }

    // 3. Logic for 'Master Surah X' quest
    if (userQuest.quest.targetSurah && surahCompleted && surahId === userQuest.quest.targetSurah) {
      await this.completeQuest(userQuest.id);
    }
    
    // 4. Logic for 'Answer X questions from Juz Y' quest - **FIXED**
    if (userQuest.quest.targetJuz && isCorrect && juzId === userQuest.quest.targetJuz) {
        const correctAnswersThisWeekFromJuz = await this.prisma.userAnswer.count({
            where: {
                userId,
                isCorrect: true,
                answeredAt: { gte: startOfWeek },
                game: {
                    surah: {
                        juz: {
                            id: userQuest.quest.targetJuz,
                        },
                    },
                },
            },
        });
        if (userQuest.quest.targetCount && correctAnswersThisWeekFromJuz >= userQuest.quest.targetCount) {
            await this.completeQuest(userQuest.id);
        }
    }
  }

  async completeQuest(userQuestId: string) {
    const userQuest = await this.prisma.userQuest.findUnique({
      where: { id: userQuestId },
      include: { quest: true, user: { select: { id: true, totalXP: true } } },
    });

    if (userQuest && userQuest.status === QuestStatus.IN_PROGRESS) {
      await this.prisma.userQuest.update({
        where: { id: userQuest.id },
        data: { status: QuestStatus.COMPLETED, completedAt: new Date() },
      });

      await this.prisma.credential.update({
        where: { id: userQuest.userId },
        data: { totalXP: { increment: userQuest.quest.xpReward } },
      });

      console.log(`User ${userQuest.userId} completed quest "${userQuest.quest.title}" and received ${userQuest.quest.xpReward} XP.`);
      return userQuest;
    }
    return null;
  }


async createBulk() {
    try {
      //  Step 1: Locate and read the JSON file
      const filePath = path.join(process.cwd(), 'quests_merged.json');

      if (!fs.existsSync(filePath)) {
        throw new ForbiddenException('quests_merged.json file not found in project root');
      }

      const rawData = fs.readFileSync(filePath, 'utf-8');
      const dataArray = JSON.parse(rawData);

      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new ForbiddenException('quests_merged.json is empty or not a valid array');
      }

      const uniqueSurahIds = [...new Set(dataArray.map((d) => d.surahId))];
      const uniqueAyahIds = [...new Set(dataArray.map((d) => d.ayahId))];

      const existingSurahs = await this.prisma.surah.findMany({
        where: { id: { in: uniqueSurahIds } },
        select: { id: true },
      });

      const existingAyahs = await this.prisma.ayah.findMany({
        where: { id: { in: uniqueAyahIds } },
        select: { id: true },
      });

      const foundSurahIds = existingSurahs.map((s) => s.id);
      const foundAyahIds = existingAyahs.map((a) => a.id);

      const missingSurahs = uniqueSurahIds.filter((id) => !foundSurahIds.includes(id));
      const missingAyahs = uniqueAyahIds.filter((id) => !foundAyahIds.includes(id));

      if (missingSurahs.length > 0) {
        console.warn('⚠ Missing Surahs:', missingSurahs);
      }
      if (missingAyahs.length > 0) {
        console.warn('⚠ Missing Ayahs:', missingAyahs);
      }

      //  Step 4: Prepare and insert data into gameData
      const result = await this.prisma.gameData.createMany({
        data: dataArray.map((d) => ({
          surahId: d.surahId ?? null,
          ayahId: d.ayahId ?? null,
          arabicText: d.arabicText,
          indonesianText: d.indonesianText,
          audioUrl: d.audioUrl ?? null,
          correctArabic: d.correctArabic,
          optionsArabic: d.optionsArabic,
          correctEnglish: d.correctEnglish,
          optionsEnglish: d.optionsEnglish,
          correctIndonesian: d.correctIndonesian,
          optionsIndonesian: d.optionsIndonesian,
        })),
        skipDuplicates: true,
      });

      //  Step 5: Return summary
      return {
        message: `✅ Successfully inserted ${result.count} records from quests_merged.json.`,
      };
    } catch (err) {
      console.error('❌ Error during bulk insert:', err);
      throw new InternalServerErrorException(err.message);
    }
  }
}