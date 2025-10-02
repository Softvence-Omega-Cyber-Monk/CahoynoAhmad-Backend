
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'login with your Email',
    example: 'user@example.com',
  })
  @IsEmail()
 @IsOptional()
  @IsString()
  email: string;
  @ApiProperty({
    description: 'login with your Email',
    example: '12345678',
  })
 @IsOptional()
  @IsString()
  phone: string;

   @ApiProperty({
    description: 'give your password',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
