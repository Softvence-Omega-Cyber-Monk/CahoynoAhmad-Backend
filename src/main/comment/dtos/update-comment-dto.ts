import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The content of the comment.',
    example: 'This is a great post!',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  content?: string;
}
