import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';

import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // This function will create user
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
       const { password } = createAuthDto;
        const hasshedPassword = await bcrypt.hash(password, 10);
         const credential = await this.prisma.credential.create({
          data: {
            email: createAuthDto.email,
            password: hasshedPassword,
            firstName: createAuthDto.firstName,
            lastName:createAuthDto.lastName,
            role: createAuthDto.role,
            phone:createAuthDto.phone
          },
        });
        return credential;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // This function for login user
async login(loginDto: LoginDTO) {
  const { email, phone, password } = loginDto;
  try {
    // --- Find user by email OR phone ---
    const user = await this.prisma.credential.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // --- Check password ---
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    // --- Build JWT payload ---
    const payload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  } catch (error) {
    throw new HttpException(
      error.message || 'Login failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


  //forget-password
  async forgetPassword(email: string) {
    const user = await this.prisma.credential.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const token = randomBytes(32).toString('hex');
    await this.prisma.credential.update({
      where: { email },
      data: { resetToken: token },
    });
    const resetUrl = `${process.env.BASE_URL}reset-password?token=${token}`;
    console.log(resetUrl);
    await this.mailService.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<h1>Password Reset Request</h1><p>Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
      from: process.env.SMTP_USER as string,
    });

    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.credential.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.credential.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null },
    });

    return { message: 'Password reset successful' };
  }
}
