
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'login with your Email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

   @ApiProperty({
    description: 'give your password',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
