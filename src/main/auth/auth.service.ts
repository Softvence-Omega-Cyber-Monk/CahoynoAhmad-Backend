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
      if(createAuthDto.referCode){
        const refferUser = await this.prisma.credential.findFirst({
          where:{
            referCode:createAuthDto.referCode
          }
        });
        if(refferUser){
          await this.prisma.credential.update({
            where:{
              id:refferUser.id
            },
            data:{
              totalAffiliate:{increment:1}
            }
          });
        }
        console.log(refferUser)
      }
      
      const { password } = createAuthDto;
      const hasshedPassword = await bcrypt.hash(password, 10);
      const refferToken= randomBytes(16).toString('hex');
      const affilateLink = `${process.env.SERVER_BASE_URL}/auth/link?token=${refferToken}`;
      const credential = await this.prisma.credential.create({
        data: {
          email: createAuthDto.email,
          password: hasshedPassword,
          name: createAuthDto.name,
          affiliateLink: affilateLink,
          referCode:refferToken
        },
      });
      return credential;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // This function for login user
  async login(loginDto: LoginDTO) {
    const { email, password } = loginDto;
    try {
      // --- Find user by email OR phone ---
      const user = await this.prisma.credential.findFirst({
        where: {
          OR: [...(email ? [{ email }] : [])],
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
        name: user.name,
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
  const otp = Math.floor(1000 + Math.random() * 9000); 
  
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await this.prisma.credential.update({
    where: { email },
    data: {
      otp: otp,
    },
  });

  // Send the OTP via email
  await this.mailService.sendMail({
    to: email,
    subject: 'Password Reset OTP',
    html: `<h1>Password Reset Request</h1><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    from: process.env.SMTP_USER as string,
  });

  return { message: 'Password reset OTP sent successfully' };
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

  async recordClick(referralToken: string): Promise<void> {
    const referrer = await this.prisma.credential.findFirst({
      where: { referCode: referralToken },
    });

    if (referrer) {
      await this.prisma.credential.update({
        where: { id: referrer.id },
        data: { totalClick: { increment: 1 } }
      });
    }
  }

  async verifyOtpAndResetPassword(email: string, newPassword: string) {
  const user = await this.prisma.credential.findUnique({
    where: { email },
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.prisma.credential.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
    },
  });

  return { message: 'Password reset successful' };
}

async verifyOtp( otp: string) {
  const user = await this.prisma.credential.findFirst({
    where: { otp:parseInt(otp) },
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  if (user.otp !== parseInt(otp)) {
    throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
  }

  return { message: 'OTP verification successful' };
}
}