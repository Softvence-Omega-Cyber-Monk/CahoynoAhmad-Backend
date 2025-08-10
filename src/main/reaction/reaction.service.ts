import { HttpException, Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { TJwtPayload } from 'src/types/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReactionType } from 'generated/prisma';

@Injectable()
export class ReactionService {
  constructor(private readonly prisma: PrismaService) {}

  //Create Reaction.
  async reactToPost(dto: CreateReactionDto, user: TJwtPayload) {
    //Check if post exist or not
    const isPostExit = await this.prisma.post.findUnique({
      where: {
        id: dto.postId,
      },
    });
    if (!isPostExit) {
      throw new HttpException('Post not found', 404);
    }

    //Check if reaction exist or not of this post for a specific user.
    const reactionExist = await this.prisma.reaction.findUnique({
      where: {
        postId_userId: {
          postId: dto.postId,
          userId: user.userId,
        },
      },
    });

    let result;

    //If reaction does not exist creact new one
    if (!reactionExist) {
      result = await this.prisma.reaction.create({
        data: {
          ...dto,
          userId: user.userId,
        },
      });

      //If reaction exist update it.
    } else {
      result = await this.prisma.reaction.update({
        where: {
          postId_userId: {
            postId: dto.postId,
            userId: user.userId,
          },
        },
        data: {
          type: dto.type,
        },
      });
    }
    return result;
  }

  //Get Reaction conunts
  async getReactionCounts(postId: string) {
    const counts = await this.prisma.reaction.groupBy({
      by: 'type',
      where: { postId },
      _count: { type: true },
    });
    const result = Object.values(ReactionType).reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});
    counts.forEach((item) => (result[item.type] = item._count.type));
    return result;
  }
}
