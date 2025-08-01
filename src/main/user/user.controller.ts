import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req) {
    const user = req.user;
    try {
      const result = this.userService.getMe(user);
      return {
        statusCode: 200,
        success: true,
        message: 'User retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
