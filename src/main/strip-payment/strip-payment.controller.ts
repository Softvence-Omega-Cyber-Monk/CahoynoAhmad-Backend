import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';

import { StripeService } from './strip-payment.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async create(@Body() createStripeDto: any) {
    return this.stripeService.create(createStripeDto);
  }

  @Post('webhook')
  async handleWebhook(@Request() req, @Body() body: any) {
    return this.stripeService.handleWebhook(req, body);
  }

  @Get('/success')
  async findAll(@Request() req) {
    console.log('req.query.session_id', req.query.session_id);
    return await this.stripeService.findAll(
      req.query.session_id as { season_id: string },
    );
  }
}
