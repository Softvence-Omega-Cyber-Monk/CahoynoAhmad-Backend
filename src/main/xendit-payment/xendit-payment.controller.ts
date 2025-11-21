// src/xendit-payment/xendit-payment.controller.ts

import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  HttpCode, 
  UsePipes, 
  ValidationPipe,
  Logger,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
  InternalServerErrorException,
  Patch,
  Param,
  Get,
  Query
} from '@nestjs/common';
import { XenditPaymentService } from './xendit-payment.service';

import { CreateXenditPaymentDto } from './dto/create-xendit-payment.dto'; 
import type { XenditInvoiceEvent } from './dto/event.interface';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateWithdrawalRequestDto } from './dto/createWithdrawRequest.dto';
import { GetWithdrawlsDto } from './dto/getWithdrawls.dto';

@Controller('xendit-payment')
@UsePipes(new ValidationPipe({ transform: true }))
export class XenditPaymentController {
  private readonly logger = new Logger(XenditPaymentController.name);

  constructor(private readonly xenditPaymentService: XenditPaymentService) {}
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
  @Post('invoice')
  @HttpCode(HttpStatus.CREATED) 
  async createInvoice(@Body() createInvoiceDto: CreateXenditPaymentDto,@Req() req:any) {
    try{
      const user=req.user
         this.logger.log(`Received request to create invoice for: ${user.email}`);
      const invoice = await this.xenditPaymentService.createInvoice(createInvoiceDto,user.email);
      return invoice
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


//   @Post('webhook')
//   @HttpCode(HttpStatus.OK)
//   async handleWebhook(
//     @Headers('x-callback-token') xCallbackToken: string,
//     // 💡 CHANGE: Receive the body as a Buffer (which is what you're seeing)
//     @Body() rawBody: Buffer
//   ) {
//     let event: any;

//     // 1. Manually parse the raw buffer into the expected JSON object
//     try {
//       // Decode the buffer into a string, then parse the string into JSON
//       event = JSON.parse(rawBody.toString('utf8')) as any;
//       console.log(event)
//     } catch (e) {
//       this.logger.error('Failed to parse webhook body as JSON.', e);
//       // Return 200 to prevent retries for malformed payload
//       return { received: true, message: 'Invalid JSON payload format.' }; 
//     }

//     try {
//       this.xenditPaymentService.validateWebhookSignature(xCallbackToken);
//     } catch (error) {
//       this.logger.warn(`Webhook received with invalid token: ${xCallbackToken ? xCallbackToken.substring(0, 10) + '...' : 'none'}. Acknowledging to stop retries.`);
//       return { received: true, message: 'Invalid token, but acknowledged.' };
//     }

//     // 3. Validate Data (This check should now pass for a valid Invoice event)
//     if (!event || !event.external_id) {
//          this.logger.error(`Webhook body is missing essential data. Event type: ${event?.event || 'N/A'}.`);
//          return { received: true, message: 'Missing data in payload.' };
//     }

//     // 4. Process Event
//     await this.xenditPaymentService.processWebhookEvent(event);
//     return { received: true };
//   }
// }


@Post('payment/withdraw')
 @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
@ApiBody({type:CreateWithdrawalRequestDto})
async createWithdreawlRequest(@Body() dto:CreateWithdrawalRequestDto,@Req() req:any){
 
 try{
  const user=req.user
  console.log(user)
  const res=await this.xenditPaymentService.createWithdrawlRequst(dto,user.userId)
  return{
    status:HttpStatus.OK,
    message:"Withdrawl request submited successfull"
  }
 }catch(error){
  throw new InternalServerErrorException(error.message,error.status)
 }
}


@Patch('payment/accept-withdraw/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin accepts a pending withdrawal request' })
  @ApiParam({ name: 'id', description: 'Withdrawal request ID' })
  @ApiResponse({ status: 200, description: 'Withdrawal processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request / Insufficient balance' })
  @ApiResponse({ status: 404, description: 'Withdrawal request not found' })
  async acceptWithdraw(@Param('id') id: string, @Req() req: any) {
    try {
      // Optional: check if user is ADMIN
      const user = req.user;
      if (user.role !== 'ADMIN') {
        throw new InternalServerErrorException('Only admins can approve withdrawals');
      }

      const result = await this.xenditPaymentService.acceptWithdrawRequestManual(id, user.userId);

      return {
        status: HttpStatus.OK,
        message: 'Withdrawal request processed successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Failed to accept withdrawal: ${error.message}`, error.stack);
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }


  @Get('withdrawl-request')
  async getAllWithdrawelRequest(@Query() filter:GetWithdrawlsDto){
    try{
      const res=await this.xenditPaymentService.getWithdrawals(filter)
      return{
        status:HttpStatus.OK,
        message:"Withdrawls request fetched successfully",
        data:res
        
      }
    }catch(error){
      throw new InternalServerErrorException(error.messge,error.status)
    }
  }


  @Patch('decline-payment')
  async declinePayment(){
    try{

    }catch(error){
      throw new InternalServerErrorException(error.message, error.status)
    }
  }
}
