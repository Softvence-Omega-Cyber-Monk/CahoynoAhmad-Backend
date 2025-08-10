import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDTO {
  @ApiProperty({
    description: 'The text content of the post',
    example: 'This is my first post!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Optional image file for the post',
    type: 'string',
    format: 'binary', // tells Swagger it's a file
    required: false,
  })
  @IsOptional()
  image?: Express.Multer.File;
}
