import { Injectable } from '@nestjs/common';
import { TJwtPayload } from 'src/types/user';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  // create post
  async createPost(
    content: string,
    file: Express.Multer.File,
    loginUser: TJwtPayload,
  ) {
    let imageUrl: string | null = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      imageUrl = result.secure_url;
    }
    const result = await this.prismaService.post.create({
      data: {
        content,
        image: imageUrl,
        userId: loginUser.userId,
      },
    });
    return result;
  }

  //Get All Post
  async getAllPost() {
    const result = await this.prismaService.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            userProfile: {
              select: {
                profilePhoto: true,
              },
            },
          },
        },
      },
    });
    return result;
  }

  //Get Post Details
  async getPostDetails(postId: string) {
    const result = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            userProfile: {
              select: {
                profilePhoto: true,
              },
            },
          },
        },
      },
    });
    return result;
  }
}
