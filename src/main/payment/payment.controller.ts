import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Req,
  Headers,
  Body,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({type:CreateAdminDto})
  async makePayment(@Req() req: any,@Body() dto:CreatePaymentDto) {
    try {
      const user = req.user;
      const res = await this.paymentService.createCheckoutSession(user,dto);
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
