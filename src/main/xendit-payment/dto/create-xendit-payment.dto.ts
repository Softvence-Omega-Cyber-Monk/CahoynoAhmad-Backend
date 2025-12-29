// src/main/xendit-payment/dto/create-xendit-payment.dto.ts

import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
