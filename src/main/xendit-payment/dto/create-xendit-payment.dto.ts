
import { 
  IsNotEmpty, 
  IsEmail, 
  IsNumber, 
  IsPositive, 
  IsString, 
  Min,
  IsOptional
} from 'class-validator';
import { 
  ApiProperty, 
  ApiPropertyOptional
} from '@nestjs/swagger'; 

export class CreateXenditPaymentDto {
  
  @ApiProperty({
    description: 'The total amount to be charged for the payment.',
    example: 50000,
    minimum: 1000,
  })
  @IsNotEmpty({ message: 'Amount is required.' })
  @IsNumber({}, { message: 'Amount must be a valid number.' })
  @IsPositive({ message: 'Amount must be a positive value.' })
  @Min(1000, { message: 'Minimum amount for this currency is 1000 (e.g., IDR 1,000).' }) 

  amount: number;

  @ApiProperty({
    description: 'The email address of the payer. Used for sending payment instructions.',
    example: 'customer@example.com',
  })
  @IsNotEmpty({ message: 'Customer email is required.' })
  @IsEmail({}, { message: 'Must be a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'A brief description for the invoice.',
    example: 'Pro Plan Subscription for 1 month',
  })
  @IsNotEmpty({ message: 'Item description is required.' })
  @IsString({ message: 'Description must be a string.' })
  description: string;
  
  @ApiPropertyOptional({
    description: 'The currency code of the invoice.',
    example: 'IDR',
    default: 'IDR',
  })
  @IsOptional()
  @IsString({ message: 'Currency must be a string.' })

  currency?: string = 'IDR'; 
  
  @ApiPropertyOptional({
    description: 'Optional custom data to be passed and returned in the webhook.',
    example: '{ "userId": 12345 }',
    type: String, 
  })
  @IsOptional() 
  @IsString({ message: 'Custom metadata must be a string.' })

  metadata?: string; 
}