// src/game/game.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {
    return this.prisma.gameData.create({
      data: {
        surahId: createGameDto.surahId ?? null,
        ayahId: createGameDto.ayahId ?? null,
        arabicText: createGameDto.arabicText,
        englishText: createGameDto.englishText,
        audioUrl: createGameDto.audioUrl ?? null,
        correct: createGameDto.correct,
        options: createGameDto.optionsEnglish,
        correctArabic: createGameDto.correctArabic,
        optionsArabic: createGameDto.optionsArabic,
      },
    });
  }
  
  async findAll() {
    return this.prisma.gameData.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
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
        englishText: updateGameDto.englishText,
        audioUrl: updateGameDto.audioUrl ?? null,
        correct: updateGameDto.correct,
        options: updateGameDto.optionsEnglish,
        correctArabic: updateGameDto.correctArabic,
        optionsArabic: updateGameDto.optionsArabic,
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


// inside GameService
async submitAnswer(userId: string, gameId: string, answer: string) {
    // 1. Fetch the question to get its data, including the surahId
    const game = await this.prisma.gameData.findUnique({ where: { id: gameId } });
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
    const isCorrect = normalize(answer) === normalize((game as any).correct) ||
      normalize(answer) === normalize((game as any).correctArabic);

    // 4. Save or update the user's answer for this specific question.
    const existingAnswer = await this.prisma.userAnswer.findFirst({
      where: { userId, gameId },
    });

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

    // 5. Find or create the user's progress for this surah and update their score.
    if (!progress) {
      progress = await this.prisma.userGameProgress.create({
        data: {
          userId,
          surahId: game.surahId!,
          completed: false,
          score: isCorrect ? 1 : 0,
        },
      });
    } else {
      await this.prisma.userGameProgress.update({
        where: { id: progress.id },
        data: { score: { increment: isCorrect ? 1 : 0 } },
      });
      // Re-fetch the progress to get the updated score.
      progress = await this.prisma.userGameProgress.findUnique({
        where: { id: progress.id },
      });
    }

    // 6. Count total questions in the surah.
    const totalQuestions = await this.prisma.gameData.count({
      where: { surahId: game.surahId },
    });

    let completed = false;

    // 7. Check if the user's score (correct answers) equals the total questions.
    if (progress?.score === totalQuestions) {
      if (!progress?.completed) {
        completed = true;
        await this.prisma.userGameProgress.update({
          where: { id: progress.id },
          data: { completed: true },
        });

        // Reward XP only once per surah completion
        await this.prisma.credential.update({
          where: { id: userId },
          data: { totalXP: { increment: 20 } },
        });
      } else {
        completed = true; // The surah was already completed
      }
    }

    // Return the result to the caller.
    return { isCorrect, answeredCount: progress?.score, totalQuestions, completed };
  }



}
