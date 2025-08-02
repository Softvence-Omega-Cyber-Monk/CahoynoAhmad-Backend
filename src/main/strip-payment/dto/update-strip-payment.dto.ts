import { PartialType } from '@nestjs/mapped-types';
import { CreateStripPaymentDto } from './create-strip-payment.dto';

export class UpdateStripPaymentDto extends PartialType(CreateStripPaymentDto) {}
