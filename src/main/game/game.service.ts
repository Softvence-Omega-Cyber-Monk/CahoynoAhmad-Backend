// src/game/game.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestStatus, QuestType } from 'generated/prisma';



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
        correct: createGameDto.correct,
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
        correct: updateGameDto.correct,
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
    return this.prisma.gameData.delete({
      where: { id },
    });
  }
  
  async submitAnswer(userId: string, gameId: string, answer: string) {
    // 1. Fetch the question and related data (surah, juz)
    const game = await this.prisma.gameData.findUnique({ 
      where: { id: gameId },
      include: { 
        surah: {
          include: { juz: true } 
        } 
      }
    });

    if (!game) {
      throw new NotFoundException(`Question ${gameId} not found`);
    }

    // 2. Find the user's progress for this surah and check if it's already completed.
    let progress = await this.prisma.userGameProgress.findFirst({
      where: { userId, surahId: game.surahId! },
    });

    if (progress?.completed) {
      throw new ForbiddenException('Surah already completed, cannot submit more answers.');
    }

    // 3. Normalize answers and check correctness.
    const normalize = (s?: string) => (s ?? '').trim().toLowerCase();
    const isCorrect = normalize(answer) === normalize(game.correct) ||
      normalize(answer) === normalize(game.correctArabic);

    // 4. Check for an existing answer for this question and user.
    const existingAnswer = await this.prisma.userAnswer.findFirst({
      where: { userId, gameId },
    });

    let scoreIncrement = 0;
    
    // 5. Determine if a score increment is warranted.
    if (!existingAnswer) {
      // First time answering this question.
      if (isCorrect) {
        scoreIncrement = 1;
      }
    } else {
      // User has answered before. Check if they were previously incorrect.
      if (!existingAnswer.isCorrect && isCorrect) {
        scoreIncrement = 1;
      }
    }

    // 6. Create or update the user's answer record.
    if (existingAnswer) {
      await this.prisma.userAnswer.update({
        where: { id: existingAnswer.id },
        data: { isCorrect, answeredAt: new Date() },
      });
    } else {
      await this.prisma.userAnswer.create({
        data: { userId, gameId, isCorrect },
      });
    }

    // 7. Update the user's progress for this surah.
    if (!progress) {
      progress = await this.prisma.userGameProgress.create({
        data: {
          userId,
          surahId: game.surahId!,
          completed: false,
          score: scoreIncrement,
        },
      });
    } else {
      await this.prisma.userGameProgress.update({
        where: { id: progress.id },
        data: { score: { increment: scoreIncrement } },
      });
      progress = await this.prisma.userGameProgress.findUnique({
        where: { id: progress.id },
      });
    }

    // 8. Count total questions in the surah.
    const totalQuestions = await this.prisma.gameData.count({
      where: { surahId: game.surahId },
    });

    let completedSurah = false;

    // 9. Check if the user's score (correct answers) equals the total questions.
    if (progress?.score === totalQuestions) {
      if (!progress?.completed) {
        completedSurah = true;
        await this.prisma.userGameProgress.update({
          where: { id: progress.id },
          data: { completed: true },
        });

        // Reward XP for surah completion
        await this.prisma.credential.update({
          where: { id: userId },
          data: { totalXP: { increment: 20 } },
        });

        // Check for quests related to surah completion
        await this.completeDailyQuest(userId, game.surahId, game.ayahId!);
      } else {
        completedSurah = true;
      }
    }
    
    // Check for weekly quests
    await this.checkAndCompleteWeeklyQuests(userId, isCorrect, completedSurah, game.surahId, game.surah?.juzId);
    
    // Return the result to the caller.
    return { isCorrect, answeredCount: progress?.score, totalQuestions, completed: completedSurah };
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
}