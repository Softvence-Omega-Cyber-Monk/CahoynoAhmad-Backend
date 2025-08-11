import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Res,
  HttpCode,
  Header,
  Req,
} from '@nestjs/common';

import { StripeService } from './strip-payment.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-subscription')
  async create(@Body() createStripeDto: any) {
    return this.stripeService.createSubscription(createStripeDto);
  }

  @Post('webhook')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      await this.stripeService.handleWebhook(req);
      res.json();
    } catch (err: any) {
      console.error('Webhook handler error:', err.message);
    
    }
  }

}
