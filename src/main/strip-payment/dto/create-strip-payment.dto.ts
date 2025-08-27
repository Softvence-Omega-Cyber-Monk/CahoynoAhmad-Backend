import { ApiProperty } from '@nestjs/swagger';

export class CreateStripePaymentDto {
  @ApiProperty({
    example: 3900,
    description: 'Amount in smallest currency unit (e.g., cents for USD)',
  })
  amount: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Customer email address',
  })
  email: string;

  @ApiProperty({
    example: '+8801712345678',
    description: 'Customer phone number',
  })
  phone: string;

  @ApiProperty({
    example: 'tok_visa',
    description: 'Stripe payment token or payment method ID',
  })
  token: string;

  @ApiProperty({
    example: 'basic',
    description: 'Plan type selected by the user (e.g., basic, premium)',
  })
  plan: string;

  @ApiProperty({
    example: '6',
    description: 'Number of months for subscription',
  })
  month: string;
}
