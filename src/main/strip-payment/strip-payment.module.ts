import { Module } from '@nestjs/common';

import { StripeService } from './strip-payment.service';
import { StripeController } from './strip-payment.controller';


@Module({
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripPaymentModule {}
