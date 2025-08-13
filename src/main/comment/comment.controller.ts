import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
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

  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @Get(':postId')
  async getAllCommentsByPost(
    @Param('postId') postId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      const result = await this.commentService.getAllComments(
        postId,
        page,
        limit,
      );
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
