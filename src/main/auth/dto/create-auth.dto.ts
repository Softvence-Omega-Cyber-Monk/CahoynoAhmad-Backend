

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
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
  
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
    @ApiProperty({
    description: 'Unique username chosen by the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Role of the user in the system',
    example: 'TRAINEE',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
