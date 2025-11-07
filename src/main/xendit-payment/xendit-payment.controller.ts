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
  HttpStatus // Added HttpStatus for clean code
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
  @HttpCode(HttpStatus.CREATED) // Use 201 for resource creation
  async createInvoice(@Body() createInvoiceDto: CreateXenditPaymentDto) {
    this.logger.log(`Received request to create invoice for: ${createInvoiceDto.email}`);

    return this.xenditPaymentService.createInvoice(createInvoiceDto);
  }


  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('x-callback-token') xCallbackToken: string,
    // 💡 CHANGE: Receive the body as a Buffer (which is what you're seeing)
    @Body() rawBody: Buffer
  ) {
    let event: any;

    // 1. Manually parse the raw buffer into the expected JSON object
    try {
      // Decode the buffer into a string, then parse the string into JSON
      event = JSON.parse(rawBody.toString('utf8')) as any;
      console.log(event)
    } catch (e) {
      this.logger.error('Failed to parse webhook body as JSON.', e);
      // Return 200 to prevent retries for malformed payload
      return { received: true, message: 'Invalid JSON payload format.' }; 
    }

    // Now 'event' is the object your code expects

    // const externalId = event?.data?.external_id || 'unknown' 
    // console.log(externalId)
    // this.logger.log(`Received webhook for external_id: ${externalId}. Event: ${event?.event || 'N/A'}`);
    
    // 2. Validate Token (Same as before)
    try {
      this.xenditPaymentService.validateWebhookSignature(xCallbackToken);
    } catch (error) {
      this.logger.warn(`Webhook received with invalid token: ${xCallbackToken ? xCallbackToken.substring(0, 10) + '...' : 'none'}. Acknowledging to stop retries.`);
      return { received: true, message: 'Invalid token, but acknowledged.' };
    }

    // 3. Validate Data (This check should now pass for a valid Invoice event)
    if (!event || !event.external_id) {
         this.logger.error(`Webhook body is missing essential data. Event type: ${event?.event || 'N/A'}.`);
         return { received: true, message: 'Missing data in payload.' };
    }

    // 4. Process Event
    await this.xenditPaymentService.processWebhookEvent(event);
    return { received: true };
  }
}