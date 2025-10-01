import { PartialType } from '@nestjs/swagger';
import { CreateXenditPaymentDto } from './create-xendit-payment.dto';

export class UpdateXenditPaymentDto extends PartialType(CreateXenditPaymentDto) {}
