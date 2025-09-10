import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Req,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async makePayment(@Req() req: any) {
    try {
      const user = req.user;
      const res = await this.paymentService.makePayment(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment Successful',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
        data: null,
      };
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      // Extract raw body and signature for the service method
      const res = await this.paymentService.handleWebhook(
        req.rawBody || req.body,
        signature,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Payment Successful',
        data: res,
      };
    } catch (error: any) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'Webhook failed',
        data: null,
      };
    }
  }
}
