import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TJwtPayload } from 'src/types/user';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { UpdateCommentDto } from './dtos/update-comment-dto';

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
  async getAllComments(postId: string, page: number = 1, limit: number = 6) {
    // Check if post exist
    const isPostExist = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!isPostExist) {
      throw new HttpException('Post does not exist', 404);
    }
    // Fetch all comments
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

    // Organize the nested comments formates.
    const commentMap = new Map<string, any>();

    comments.forEach((comment: any) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    let nestedComments: any = [];
    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        nestedComments.push(comment);
      }
    });

    // Implement Pagination
    const start = (page - 1) * limit;
    const paginatedTopLevelComments = nestedComments.slice(
      start,
      start + limit,
    );

    return {
      totalTopLevelComments: nestedComments.length,
      page,
      limit,
      comments: paginatedTopLevelComments,
    };
  }

  async updateComment(
    commentId: string,
    updatedData: UpdateCommentDto,
    user: TJwtPayload,
  ) {
    // Check if comment exist
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new HttpException('Comment does not exist', 404);
    }

    // Check if user autharize to update this comment
    if (user.userId !== comment.userId) {
      throw new HttpException(
        'You are not authorize to update this comment.',
        403,
      );
    }

    const updatedComment = await this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: updatedData.content,
      },
    });
    return updatedComment;
  }
}
