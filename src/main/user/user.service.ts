import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TUser } from 'src/types/user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Retrieves the profile of the currently authenticated user.
  async getMe(user: Partial<TUser>) {
    try {
      const profile = await this.prisma.credential.findUnique({
        where: {
          id: user.userId,
        },
      });

      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Updates the profile of the currently authenticated user.
  async updateProfile(user: Partial<TUser>, updateProfileDto: UpdateUserDto) {
    try {
      const profile = await this.prisma.credential.update({
        where: {
          id: user.userId,
        },
        data: {
          ...updateProfileDto,
        },
      });
      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
