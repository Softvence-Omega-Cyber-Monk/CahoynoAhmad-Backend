import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReactionType } from 'generated/prisma';

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsEnum(ReactionType, { message: 'Invalid reaction type' })
  type: ReactionType;
}
