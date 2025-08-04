import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    try{
      const subscription=await this.prisma.subscription.create({
        data:{
          ...createSubscriptionDto
        }
      })
      return subscription
    }catch(error){
      throw new HttpException(error.message,500)
    }
    
  }

 async findAllSubscription() {
    try{
      const result=await this.prisma.subscription.findMany()
      return result
    }catch(error){
      throw new HttpException(error.message, 500)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
