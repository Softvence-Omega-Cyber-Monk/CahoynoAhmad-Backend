// import { IsString } from 'class-validator';

// export class CreateContactDto {
//   @IsString()
//   name: string;
//   @IsString()
//   email: string;
//   @IsString()
//   phone: string;
//   @IsString()
//   message: string;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Full name of the person contacting',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the person contacting',
    example: 'john.doe@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Phone number of the person contacting',
    example: '+1 555-123-4567',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Message content sent by the user',
    example: 'Hello, I would like to know more about your services.',
  })
  @IsString()
  message: string;
}
