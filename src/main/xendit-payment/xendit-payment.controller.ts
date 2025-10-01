// src/xendit-payment/xendit-payment.controller.ts

import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  HttpCode, 
  UsePipes, 
  ValidationPipe,
  Logger 
} from '@nestjs/common';
import { XenditPaymentService } from './xendit-payment.service';

import { CreateXenditPaymentDto } from './dto/create-xendit-payment.dto'; 
import type { XenditInvoiceEvent } from './dto/event.interface';

@Controller('xendit-payment')
@UsePipes(new ValidationPipe({ transform: true }))
export class XenditPaymentController {
  private readonly logger = new Logger(XenditPaymentController.name);

  constructor(private readonly xenditPaymentService: XenditPaymentService) {}

  @Post('invoice')
  async createInvoice(@Body() createInvoiceDto: CreateXenditPaymentDto) {
    console.log(createInvoiceDto)
    this.logger.log(`Received request to create invoice for: ${createInvoiceDto.email}`);

    return this.xenditPaymentService.createInvoice(createInvoiceDto);
  }

  @Post('webhook')
  @HttpCode(200) 
  async handleWebhook(

    @Headers('x-callback-token') xCallbackToken: string,

    @Body() event: XenditInvoiceEvent
  ) {
    this.logger.log(`Received webhook for external_id: ${event.data.external_id}`);
    try {
      this.xenditPaymentService.validateWebhookSignature(xCallbackToken);
    } catch (error) {
      this.logger.warn(`Webhook received with invalid token: ${xCallbackToken ? xCallbackToken.substring(0, 10) + '...' : 'none'}`);
      return { received: true, message: 'Invalid token, but acknowledged.' };
    }

    await this.xenditPaymentService.processWebhookEvent(event);
    return { received: true };
  }
}