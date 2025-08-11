import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReactionType } from 'generated/prisma';

export class CreateReactionDto {
  @ApiProperty({
    example: 'c3f8f6e1-8c5a-4d9d-9d8a-7a1b4b6c8d9f',
    description: 'The unique identifier of the post the reaction belongs to.',
    type: String,
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    description: 'Type of reaction to the post.',
    enum: ReactionType, // <-- dropdown values in Swagger
    enumName: 'ReactionType', // <-- shows the enum name
    example: ReactionType.LOVE, // <-- pre-selected example
  })
  @IsEnum(ReactionType, { message: 'Invalid reaction type' })
  type: ReactionType;
}
