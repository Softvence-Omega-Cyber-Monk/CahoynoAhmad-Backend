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
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { CreateNoteDTO } from './dto/create-note.dto';

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
  async updateProfile(@Body() updateProfileDto: any, @Request() req) {
    const user = req.user;
    try {
      const result = await this.userService.updateProfile(
        user,
        updateProfileDto,
      );
      return {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('note')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({type:CreateNoteDTO})
  async createNote(@Body() createNoteDto:CreateNoteDTO, @Request() req) {
    const user = req.user;
    console.log(user)
    try {
      const result = await this.userService.createNote(user.userId,createNoteDto);
      return {
        statusCode: 200,
        success: true,
        message: 'Note created successfully',
        data: result,
      };
    } catch (error) {
      return{
        statusCode: error.status,
        success: false,
        message: error.message,
        data: null
      }
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
}
