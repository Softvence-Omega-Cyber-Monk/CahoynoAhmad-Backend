import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import type { Request } from 'express';
import { CreateCommentDto } from './dtos/create-comment-dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Body() dto: CreateCommentDto, @Req() req: Request) {
    try {
      const result = await this.commentService.createComment(req.user, dto);
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Your comment has been added successfully.',
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

  @Get(':postId')
  async getAllCommentsByPost(@Param('postId') postId: string) {
    try {
      const result = await this.commentService.getAllComments(postId);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Fetch all comment successfully.',
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
