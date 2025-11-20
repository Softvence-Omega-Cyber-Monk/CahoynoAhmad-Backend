import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithdrawalRequestDto {
  @ApiProperty({
    example: 50000,
    description: 'Withdrawal amount in Indonesian Rupiah (IDR). Minimum IDR 1.',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    example: 'BCA',
    description: 'Indonesian bank code. Example: BCA, BNI, BRI, MANDIRI, CIMB, PERMATA.',
  })
  @IsNotEmpty()
  @IsString()
  bankCode: string;

  @ApiProperty({
    example: '0987654321',
    description: 'The user’s Indonesian bank account number.',
  })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({
    example: 'Andi Saputra',
    description: 'Account holder name exactly as registered at the bank.',
  })
  @IsNotEmpty()
  @IsString()
  accountName: string;
}
