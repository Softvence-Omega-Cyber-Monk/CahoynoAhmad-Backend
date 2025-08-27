/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await this.prisma.subscription.create({
        data: {
          ...createSubscriptionDto,
        },
      });
      return subscription;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(errorMessage, 500);
    }
  }

  async findAllSubscription() {
    try {
      const result = await this.prisma.subscription.findMany();
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(errorMessage, 500);
    }
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    try {
      const result = await this.prisma.subscription.update({
        where: {
          id: id,
        },
        data: {
          ...updateSubscriptionDto,
        },
      });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(errorMessage, 500);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prisma.subscription.delete({
        where: {
          id: id,
        },
      });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new HttpException(errorMessage, 500);
    }
  }
}
