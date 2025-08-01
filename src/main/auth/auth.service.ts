import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async create(createAuthDto: CreateAuthDto) {
    try {
      const existingUser = await this.prisma.credential.findUnique({
        where: {
          email: createAuthDto.email,
        },
      });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      return this.prisma.$transaction(async (tx) => {
        const { password } = createAuthDto;
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
            userId: credential.id,
          },
        });

        return {
          credential,
          userProfile,
        };
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 async login(loginDto: LoginDTO) {
    const { email, password } = loginDto;

    try {
      const user = await this.prisma.credential.findUnique({
        where: { email },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      const payload = {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        userName: user.userName,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
