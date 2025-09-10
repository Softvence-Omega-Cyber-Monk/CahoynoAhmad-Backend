import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async makePayment(@Req() req:any) {
    try{
      const user=req.user
    const res=await this.paymentService.makePayment(user);
    return{
      statusCode:HttpStatus.OK,
      message:"Payment Successful",
      data:res
    }
    }catch(error){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        message:error.message,
        data:null
      }
    }
  }

  @Post('webhook')
  async handleWebhook(@Body() body:any){
    try{
      const res=await this.paymentService.handleWebhook(body);
      return{
        statusCode:HttpStatus.OK,
        message:"Payment Successful",
        data:res
      }
    }catch(error){
      return{
        statusCode:HttpStatus.BAD_REQUEST,
        message:error.message,
        data:null
      }
    }
  }
}
