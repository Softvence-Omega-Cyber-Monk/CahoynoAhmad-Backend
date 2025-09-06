// import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// export class LoginDTO {
//   @IsEmail()
//   @IsNotEmpty()
//   @IsString()
//   email: string;
//   @IsNotEmpty()
//   @IsString()
//   password: string;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'Registered user email address (must be a valid email)',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'phonbe',
    example: '1223232323',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
  @ApiProperty({
    description: 'Password for the account',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}


