import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { TUser } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

 
   // Retrieves the profile of the currently authenticated user.
  async getMe(user: Partial<TUser>) {
    try {
      const profile = await this.prisma.userProfile.findUnique({
        where: {
          userId: user.userId,
        },
        include: {
          user: true,
        },
      });
      if (profile?.user) {
        const { password, ...safeUser } = profile.user;
        return {
          ...profile,
          user: safeUser,
        };
      }
      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  // Updates the profile of the currently authenticated user.
  async updateProfile(user: Partial<TUser>, updateProfileDto: UpdateUserDto) {
    try {
      const profile = await this.prisma.userProfile.update({
        where: {
          userId: user.userId,
        },
        data: {
          ...updateProfileDto,
        },
        include: {
          user: true,
        },
      });
      if (profile?.user) {
        const { password, ...safeUser } = profile.user;
        return {
          ...profile,
          user: safeUser,
        };
      }
      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
