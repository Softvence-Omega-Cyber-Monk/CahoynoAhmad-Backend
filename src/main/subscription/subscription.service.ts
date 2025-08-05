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
      throw new HttpException(error.message, 500);
    }
  }

  async findAllSubscription() {
    try {
      const result = await this.prisma.subscription.findMany();
      return result;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const result = this.prisma.subscription.update({
        where: {
          id: id,
        },
        data: {
          ...updateSubscriptionDto,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  remove(id: string) {
    try {
      const result = this.prisma.subscription.delete({
        where: {
          id: id,
        },
      });

      return result;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
