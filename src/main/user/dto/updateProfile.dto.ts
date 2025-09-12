import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * DTO for updating user profile.
 * Only "name" is updated via DTO.
 * The "image" is handled separately as a file upload.
 */
export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user.',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
