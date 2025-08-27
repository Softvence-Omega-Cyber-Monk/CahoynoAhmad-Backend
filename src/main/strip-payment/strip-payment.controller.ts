import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Header,
  Req,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';

import { StripeService } from './strip-payment.service';
import type { Request } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { CreateStripePaymentDto } from './dto/create-strip-payment.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-subscription')
  async create(@Body() createStripeDto: any) {
    console.log(createStripeDto);
    return this.stripeService.createSubscription(createStripeDto);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    try {
      console.log('webhook received');
      await this.stripeService.handleWebhook(req);
    } catch (err: any) {
      console.error('Webhook handler error:', err.message);
    }
  }
}
