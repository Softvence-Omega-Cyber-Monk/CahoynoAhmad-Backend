import {
  Body,
  Controller,
  HttpStatus,
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
// import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body() postContent: CreatePostDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
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
}
