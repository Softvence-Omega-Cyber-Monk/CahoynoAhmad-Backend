import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment.',
    example: 'This is a great post!',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The ID of the post the comment belongs to.',
    example: '60c72b2f9b1d8e001c8a4b6c',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty({
    description: 'The ID of the parent comment, if it is a reply.',
    example: '60c72b2f9b1d8e001c8a4b6d',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}
