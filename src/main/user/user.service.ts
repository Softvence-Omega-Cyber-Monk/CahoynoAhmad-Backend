import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TUser } from 'src/types/user';
import { CreateNoteDTO } from './dto/create-note.dto';

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

  async createNote(userId: string, noteData: CreateNoteDTO) {
    console.log(noteData);
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
}
