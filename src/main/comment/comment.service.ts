import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TJwtPayload } from 'src/types/user';
import { CreateCommentDto } from './dtos/create-comment-dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  //Create comment
  async createComment(user: TJwtPayload, dto: CreateCommentDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      //Create Comment
      const newComment = await tx.comment.create({
        data: {
          content: dto.content,
          postId: dto.postId,
          parentId: dto.parentId || null,
          userId: user.userId,
        },
      });

      //Update comment count of post
      await tx.post.update({
        where: {
          id: dto.postId,
        },
        data: {
          totalComments: { increment: 1 },
        },
      });
      return newComment;
    });
    return result;
  }

  //Get all Comments of a post
  async getAllComments(postId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
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
      orderBy: { createdAt: 'asc' },
    });
    return comments;
  }
}
