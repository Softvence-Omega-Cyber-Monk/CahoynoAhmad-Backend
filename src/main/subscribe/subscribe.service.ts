import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscribeService {
  constructor(private readonly prisma: PrismaService) {}
  // create susbcribe to website as login website
  async create(createSubscribeDto: CreateSubscribeDto, user: any) {
    try {
      const { email } = createSubscribeDto;
      const isExistuser = await this.prisma.webSubscribe.findFirst({
        where: {
          email: email,
        },
      });
      if (isExistuser) {
        return 'You are already subscribed';
      }
      const response = await this.prisma.webSubscribe.create({
        data: {
          email: email,
          userId: user.userId,
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // Find all subscribe of this website
  findAll() {
    try {
      const response = this.prisma.webSubscribe.findMany();
      return response;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  remove(id: string) {
    try {
      const response = this.prisma.webSubscribe.delete({
        where: {
          id: id,
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
    return `This action removes a #${id} subscribe`;
  }
}
