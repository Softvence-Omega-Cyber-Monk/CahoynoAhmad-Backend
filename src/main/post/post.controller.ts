import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @Body() postContent: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    console.log('postContent========>', postContent);
    console.log('ImageFile========>', file);
  }
}
