import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'User email address (must be a valid email format)',
    example: 'user@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description:
      'Password for the account (minimum security requirements apply)',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Unique username chosen by the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
