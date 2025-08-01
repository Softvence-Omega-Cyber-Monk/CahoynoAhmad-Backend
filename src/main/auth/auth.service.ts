import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthDto: CreateAuthDto, profileDTO: any) {
    return this.prisma.$transaction(async (tx) => {
      const {  password} = createAuthDto;
      const hasshedPassword = await bcrypt.hash(password, 10);
      // Step 1: Create credential using createAuthDto
      const credential = await tx.credential.create({
        data: {
          email: createAuthDto.email,
          password: hasshedPassword,
          fullName: createAuthDto.fullName,
          userName: createAuthDto.userName,
        },
      });

      // Step 2: Create user profile using profileDTO and link it to credential
      const userProfile = await tx.userProfile.create({
        data: {
          ...profileDTO, 
          userId: credential.id, 
        },
      });

      return {
        credential,
        userProfile,
      };
    });
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
