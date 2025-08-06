import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostService, CloudinaryService],
  controllers: [PostController],
})
export class PostModule {}
