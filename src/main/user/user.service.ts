import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TUser } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(user: Partial<TUser>) {
    try {
      const profile = await this.prisma.userProfile.findUnique({
        where: {
          userId: user.id,
        },
        include: {
          user: true,
        },
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }
}
