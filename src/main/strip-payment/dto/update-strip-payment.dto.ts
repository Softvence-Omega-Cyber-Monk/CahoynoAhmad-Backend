import { PartialType } from '@nestjs/mapped-types';
import { CreateStripePaymentDto } from './create-strip-payment.dto';

export class UpdateStripPaymentDto extends PartialType(
  CreateStripePaymentDto,
) {}
