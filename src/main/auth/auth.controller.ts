import { Controller, Post, Body, HttpStatus, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      const result = await this.authService.create(createAuthDto);
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Post('login')
  @ApiBody({ type: LoginDTO })
  async login(@Body() LoginDto: LoginDTO) {
    try {
      const result = await this.authService.login(LoginDto);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Request a password reset via email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@gmail.com',
          description: 'The email address of the user who forgot their password.',
        },
      },
      required: ['email'],
    },
  })
  async forgetPassword(@Body() body: { email: string }) {
    try {
      const result = await this.authService.forgetPassword(body.email);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Password reset link sent successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
  

@Post('reset-password')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        newPassword: { type: 'string', example: 'newStrongPassword' },
      },
    },
  })
  async resetPassword(@Body() body: { email: string, newPassword: string }) {
    try {
      const result = await this.authService.verifyOtpAndResetPassword(
        body.email,
        body.newPassword,
      );
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Password reset successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

   @Get('link')
  async trackLink(
    @Query('token') token: string,
    @Res({ passthrough: false }) res:any
  ) {
    if (token) {
      await this.authService.recordClick(token);
    }

    res.redirect(`${process.env.BASE_URL}/signUp?token=${token}`);
  }

  @Post('otp-verification')
  @ApiBody({
    schema: {
      properties: {
        otp: { type: 'string', example: '123456' },
      },
    },
  })
  async otpVerification(@Body() body: {otp: string }) {
    try {
      const result = await this.authService.verifyOtp(body.otp);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'OTP verification successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
