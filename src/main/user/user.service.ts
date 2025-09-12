import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TUser } from 'src/types/user';
import { CreateNoteDTO } from './dto/create-note.dto';
import * as fs from 'fs/promises'; // Import the file system promises module
import * as path from 'path';
import { UpdateUserStatDto } from './dto/updateUserStat.dto';
import { UpdateUserDto } from './dto/updateProfile.dto';

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
  async updateProfile(user: Partial<TUser>, updateProfileDto: UpdateUserDto,image:any) {
    try {
         let imagerURL:string|undefined
         if(image){
          const uploadDir=path.join(process.cwd(),'uploads')
          await fs.mkdir(uploadDir,{recursive:true})
            const filename = `${user.userId}-${Date.now()}${path.extname(
            image.originalname,
          )}`
          const filepath = path.join(uploadDir, filename);
          await fs.writeFile(filepath, image.buffer);
          imagerURL=`${process.env.SERVER_BASE_URL}/uploads/${filename}`
         }
        console.log(imagerURL)
          
      const profile = await this.prisma.credential.update({
        where: {
          id: user.userId,
        },
        data: {
          ...updateProfileDto,
          image:imagerURL
        },
      });
      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Get only the stats-related fields for a user.
  async getUserStats(userId: string) {
    try {
      const user = await this.prisma.credential.findUnique({
        where: { id: userId },
        select: {
          dayStrek: true,
          budge: true,
          leavel: true,
          ayahRead: true,
          practiceTime: true,
          questCompleted: true,
          totalXP: true,
          lastActiveDate: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        dayStreak: user.dayStrek,
        badges: user.budge,
        level: user.leavel,
        ayahsRead: user.ayahRead,
        minutesPracticed: user.practiceTime,
        questsCompleted: user.questCompleted,
        totalXp: user.totalXP,
        lastActiveDate: user.lastActiveDate,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Update a user's stats based on the DTO.
async updateUserStats(userId: string, updateUserStatDto: UpdateUserStatDto) {
    try {
      // Find the user to get their current stats
      const user = await this.prisma.credential.findUnique({
        where: { id: userId },
        select: {
          dayStrek: true,
          budge: true,
          leavel: true,
          ayahRead: true,
          practiceTime: true,
          questCompleted: true,
          totalXP: true,
          lastActiveDate: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Prepare the data to be updated
      const dataToUpdate: any = {};

      // Calculate Day Streak on the backend
      if (updateUserStatDto.triggerStreakUpdate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActiveDate = user.lastActiveDate;
        let newDayStreak = user.dayStrek;

        // Check if the last activity was yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (lastActiveDate?.getTime() === yesterday.getTime()) {
          newDayStreak++;
        } else if (lastActiveDate?.getTime() !== today.getTime()) {
          newDayStreak = 1;
        }

        dataToUpdate.dayStrek = newDayStreak;
        dataToUpdate.lastActiveDate = today;
      }

      // Add to existing XP and calculate level
      if (updateUserStatDto.xpEarned) {
        const currentXP = user.totalXP || 0;
        const newTotalXP = currentXP + updateUserStatDto.xpEarned;
        dataToUpdate.totalXP = newTotalXP;

        // Determine the new level based on total XP
        let newLevel = user.leavel || 0;
        if (newTotalXP > 0 && newTotalXP <= 499) {
          newLevel = 1;
        } else if (newTotalXP > 500 && newTotalXP <= 999) {
          newLevel = 2;
        } else if (newTotalXP > 1000 && newTotalXP <= 1499) {
          newLevel = 3;
        } else if (newTotalXP > 1500 && newTotalXP <= 1999) {
          newLevel = 4;
        } else if (newTotalXP > 2000 && newTotalXP <= 2499) {
          newLevel = 5;
        } else if (newTotalXP > 2500 && newTotalXP <= 2999) {
          newLevel = 6;
        } else if (newTotalXP > 3000 && newTotalXP <= 3499) {
          newLevel = 7;
        } else if (newTotalXP > 3500 && newTotalXP <= 3999) {
          newLevel = 8;
        } else if (newTotalXP > 4000 && newTotalXP <= 4399) {
          newLevel = 9;
        } else if (newTotalXP > 4500 && newTotalXP <= 4999) {
          newLevel = 10;
        }
        dataToUpdate.leavel = newLevel;
      }

      // Update other stats if they are present in the DTO
      if (updateUserStatDto.ayahsRead) {
        dataToUpdate.ayahRead = (user.ayahRead || 0) + updateUserStatDto.ayahsRead;
      }
      if (updateUserStatDto.minutesPracticed) {
        dataToUpdate.practiceTime = (user.practiceTime || 0) + updateUserStatDto.minutesPracticed;
      }
      if (updateUserStatDto.questsCompleted) {
        dataToUpdate.questCompleted = (user.questCompleted || 0) + updateUserStatDto.questsCompleted;
      }

      const updatedUser = await this.prisma.credential.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      // Return only the stats fields from the updated record.
      return {
        dayStreak: updatedUser.dayStrek,
        badges: updatedUser.budge,
        level: updatedUser.leavel,
        ayahsRead: updatedUser.ayahRead,
        minutesPracticed: updatedUser.practiceTime,
        questsCompleted: updatedUser.questCompleted,
        totalXp: updatedUser.totalXP,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // create note of user
  async createNote(userId: string, noteData: CreateNoteDTO) {
    try {
      const isUserExist = await this.prisma.credential.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      if (!isUserExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const note = await this.prisma.note.create({
        data: {
          ...noteData,
          userId: userId,
        },
      });
      return note;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // get all notes of user
  async getNotes(userId: string) {
    try {
      const notes = await this.prisma.note.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,
        },
      });
      return notes;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // get all payment of user
  async getPayment(userId) {
    try {
      const res = await this.prisma.payment.findMany({
        where: {
          userId: userId,
        },
      });
      return res;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getLeaderboard(){
    try {
      const res = await this.prisma.credential.findMany({
        take:5,
        select: {
          id: true,
          name: true,
          totalXP: true,
          image:true
        },
        orderBy: {
          totalXP: 'desc',
        },
      });
      return res;
    } catch (error) {
      throw new HttpException(error.message, error.status);
  }
}
}
