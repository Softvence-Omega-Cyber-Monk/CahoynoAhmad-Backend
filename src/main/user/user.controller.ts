import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  HttpException,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiSecurity, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateUserStatDto } from './dto/updateUserStat.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateProfile.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMe(@Request() req) {
    const user = req.user;
    try {
      const result = await this.userService.getMe(user);
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

 @Patch('update-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Body() updateProfileDto: UpdateUserDto, 
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
  ) {
    const user = req.user;
 
    try {
      const result = await this.userService.updateProfile(
        user,
        updateProfileDto,
        image,
      );

      return {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('note')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateNoteDTO })
  async createNote(@Body() createNoteDto: CreateNoteDTO, @Request() req) {
    const user = req.user;
    console.log(user);
    try {
      const result = await this.userService.createNote(
        user.userId,
        createNoteDto,
      );
      return {
        statusCode: 200,
        success: true,
        message: 'Note created successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status,
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  @Get('note')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getNotes(@Request() req) {
    const user = req.user;
    try {
      const result = await this.userService.getNotes(user.userId);
      return {
        statusCode: 200,
        success: true,
        message: 'Notes retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPayment(@Request() req) {
    const user = req.user;
    try {
      const result = await this.userService.getPayment(user.userId);
      return {
        statusCode: 200,
        success: true,
        message: 'Payment retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user statistics' })
  async updateUserStats(@Body() updateUserStatDto: UpdateUserStatDto, @Request() req) {
    const user = req.user;
    try {
      const result = await this.userService.updateUserStats(user.userId, updateUserStatDto);
      return {
        statusCode: 200,
        success: true,
        message: 'User stats updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('leaderboard')
  async getLeaderboard(@Request() req) {
    const user = req.user;
    try {
      const result = await this.userService.getLeaderboard();
      return {
        statusCode: 200,
        success: true,
        message: 'Leaderboard retrieved successfully',
        data: result,
      };
    } catch (error) {
      return{
        statusCode: error.status,
        success: false,
        message: error.message,
        data: null,
      }
    }
  }
}
