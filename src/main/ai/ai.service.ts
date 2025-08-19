/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  // Daily generation limits by plan
  private readonly DAILY_LIMITS = {
    FREE: 5,
    HOT_MESS: 10,
    NO_FILTER: 50,
    SAVAGE_MODE: 200,
    SIPT_FOR_BRANDS: 1000,
    ONE_TIME_ROAST: 1,
    LIFETIME_NO_FILTER: 100,
    LIFETIME_SAVAGE_MODE: 500,
  };

  async create(createAiDto: CreateAiDto) {
    const { text, tone, session_id, user_plan } = createAiDto;
    console.log(createAiDto);

    try {
      // Check daily generation limit before proceeding
      await this.checkDailyLimit(session_id, user_plan);

      const response = await fetch(`${process.env.AI_URL}/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tone, text, session_id, user_plan }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(`AI service responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Track successful generation
      await this.trackGeneration(session_id, user_plan);

      return data;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  private async checkDailyLimit(userId: string, userPlan: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's generation count
    const todayCount = await this.prisma.aiGeneration.count({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const dailyLimit = this.DAILY_LIMITS[userPlan as keyof typeof this.DAILY_LIMITS] || 0;

    if (todayCount >= dailyLimit) {
      throw new HttpException(
        `Daily generation limit exceeded. Your ${userPlan} plan allows ${dailyLimit} generations per day.`,
        429, // Too Many Requests
      );
    }
  }

  private async trackGeneration(userId: string, userPlan: string): Promise<void> {
    await this.prisma.aiGeneration.create({
      data: {
        userId,
        userPlan,
        createdAt: new Date(),
      },
    });
  }

  async getRemainingGenerations(userId: string, userPlan: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = await this.prisma.aiGeneration.count({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const dailyLimit = this.DAILY_LIMITS[userPlan as keyof typeof this.DAILY_LIMITS] || 0;
    return Math.max(0, dailyLimit - todayCount);
  }

  async getDailyStats(userId: string): Promise<{
    todayCount: number;
    dailyLimit: number;
    remaining: number;
    resetTime: Date;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get user's current plan
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { subscription: true },
    });

    const userPlan = userProfile?.subscription?.planType || 'FREE';
    
    const todayCount = await this.prisma.aiGeneration.count({
      where: {
        userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const dailyLimit = this.DAILY_LIMITS[userPlan as keyof typeof this.DAILY_LIMITS] || 0;

    return {
      todayCount,
      dailyLimit,
      remaining: Math.max(0, dailyLimit - todayCount),
      resetTime: tomorrow,
    };
  }

  async getAllHistory(user) {
    try {
      const response = fetch(`${process.env.AI_URL}/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: user.userId }),
      });
      const data = await (await response).json();
      return data;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} ai`;
  }

  update(id: number, updateAiDto: UpdateAiDto) {
    return `This action updates a #${id} ai`;
  }

  remove(id: number) {
    return `This action removes a #${id} ai`;
  }
}