// import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// export class CreateAuthDto {
//   @IsEmail()
//   @IsNotEmpty()
//   @IsString()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   password: string;

//   @IsNotEmpty()
//   @IsString()
//   fullName: string;

//   @IsNotEmpty()
//   @IsString()
//   userName: string;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'User email address (must be a valid email format)',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description:
      'Password for the account (minimum security requirements apply)',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Unique username chosen by the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;
}
