import { Module } from '@nestjs/common';
import { ApplePurchaseService } from './apple-purchase.service';
import { ApplePurchaseController } from './apple-purchase.controller';

@Module({
  controllers: [ApplePurchaseController],
  providers: [ApplePurchaseService],
})
export class ApplePurchaseModule {}
