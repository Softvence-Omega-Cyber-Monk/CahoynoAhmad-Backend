import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApplePurchaseStatus } from 'generated/prisma';


export class CreateApplePurchaseDto {

  @ApiPropertyOptional({
    example: 'com.myapp.premium.monthly',
    description: 'Apple App Store product identifier',
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({
    example: 'premium_monthly',
    description: 'Internal plan reference',
  })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional({
    example: '2000000798451234',
    description: 'Apple transaction identifier',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({
    example: '2000000798451234',
    description: 'Original transaction ID for subscription lifecycle',
  })
  @IsOptional()
  @IsString()
  originalTransactionId?: string;

  @ApiPropertyOptional({
    example: '2025-01-01T10:30:00.000Z',
    description: 'Initial purchase date (ISO format)',
  })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional({
    example: '2025-02-01T10:30:00.000Z',
    description: 'Subscription expiration date',
  })
  @IsOptional()
  @IsDateString()
  expiresDate?: string;

  @ApiPropertyOptional({
    example: '2025-01-15T08:00:00.000Z',
    description: 'Date when Apple revoked the transaction (if refunded)',
  })
  @IsOptional()
  @IsDateString()
  revocationDate?: string;

  @ApiPropertyOptional({
    example: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Signed transaction info from StoreKit 2 (JWT)',
  })
  @IsOptional()
  @IsString()
  signedTransactionInfo?: string;

  @ApiPropertyOptional({
    example: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Signed renewal info from Apple (JWT)',
  })
  @IsOptional()
  @IsString()
  signedRenewalInfo?: string;

  @ApiPropertyOptional({
    example: 'base64_encoded_receipt_data',
    description: 'Apple receipt (legacy or fallback)',
  })
  @IsOptional()
  @IsString()
  recipt?: string;

  @ApiPropertyOptional({
    enum: ApplePurchaseStatus,
    example: ApplePurchaseStatus.ACTIVE,
    description: 'Current purchase status',
  })
  @IsOptional()
  @IsEnum(ApplePurchaseStatus)
  status?: ApplePurchaseStatus;
}
