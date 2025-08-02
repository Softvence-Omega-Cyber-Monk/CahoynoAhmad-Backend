import { Module } from '@nestjs/common';
import { StripPaymentService } from './strip-payment.service';
import { StripPaymentController } from './strip-payment.controller';

@Module({
  controllers: [StripPaymentController],
  providers: [StripPaymentService],
})
export class StripPaymentModule {}
