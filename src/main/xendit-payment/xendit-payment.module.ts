import { Module } from '@nestjs/common';
import { XenditPaymentService } from './xendit-payment.service';
import { XenditPaymentController } from './xendit-payment.controller';

@Module({
  controllers: [XenditPaymentController],
  providers: [XenditPaymentService],
})
export class XenditPaymentModule {}
