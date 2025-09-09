import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';

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
  @ApiBody({
    type: Object,
    schema: {
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
      },
    },
  })
  async forgetPassword(@Body() body: { email: string }) {
    console.log(body);
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
  async resetPassword(@Body() body: { token: string; password: string }) {
    try {
      const result = await this.authService.resetPassword(
        body.token,
        body.password,
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
}
