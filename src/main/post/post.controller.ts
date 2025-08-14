import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDTO } from './dtos/create-post.dto';
import express from 'express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  async createPost(
    @Body() postContent: CreatePostDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: express.Request,
  ) {
    try {
      const result = await this.postService.createPost(
        postContent.content,
        file,
        req.user,
      );
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Post created successfully',
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

  @Get()
  async getAllPost() {
    try {
      const result = await this.postService.getAllPost();
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Fetch all Post successfully',
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
  @Get(':id')
  async getPostDetails(@Param('id') postId: string) {
    try {
      const result = await this.postService.getPostDetails(postId);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Fetch post details successfully.',
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
