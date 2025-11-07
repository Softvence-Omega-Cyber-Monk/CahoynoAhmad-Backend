// src/main/xendit-payment/xendit-payment.service.ts

import { 
  Injectable, 
  InternalServerErrorException, 
  UnauthorizedException, 
  Logger 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Xendit } from 'xendit-node';
import { CreateXenditPaymentDto } from './dto/create-xendit-payment.dto';
import { XenditInvoiceEvent } from './dto/event.interface'; 

@Injectable()
export class XenditPaymentService {
  private readonly logger = new Logger(XenditPaymentService.name);
  private xenditClient: Xendit;
  private webhookToken: string;

  constructor(private configService: ConfigService) {
    const secretKey = process.env.XENDIT_SECRET_KEY as string;
    this.webhookToken = process.env.XENDIT_CALLBACK_TOKEN as string;

    if (!secretKey) {
      this.logger.error('XENDIT_SECRET_KEY is not configured in environment variables.');
      throw new InternalServerErrorException('Payment gateway not configured.');
    }

    this.xenditClient = new Xendit({ secretKey });
  }

  async createInvoice(dto: CreateXenditPaymentDto) {
    const externalId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const successUrl = this.configService.get('APP_BASE_URL') + '/payment/success';
    const failureUrl = this.configService.get('APP_BASE_URL') + '/payment/failure';

    try {
      this.logger.log(`Creating Xendit invoice for ${dto.amount} with external_id: ${externalId}`);
      
      // FIX applied in previous steps: wrapped parameters inside the 'data' property
      const invoice = await this.xenditClient.Invoice.createInvoice({
        data: { 
          externalId: externalId,
          amount: dto.amount,
          description: dto.description,
          payerEmail: dto.email, 
          successRedirectUrl: successUrl,
          failureRedirectUrl: failureUrl,
          currency: dto.currency,
          ...(dto.metadata && { metadata: JSON.parse(dto.metadata) }), 
        }
      });
      
      this.logger.log(`Xendit Invoice created successfully. ID: ${invoice.id}`);
      return {
        success: true,
        invoiceUrl: invoice.invoiceUrl,
        externalId: invoice.externalId,
        xenditId: invoice.id,
      };
    } catch (error) {
      this.logger.error('Xendit API Error on Invoice Creation:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to create payment invoice.');
    }
  }

  validateWebhookSignature(receivedToken: string): void {
    if (!receivedToken || receivedToken !== this.webhookToken) {
      throw new UnauthorizedException('Invalid X-Callback-Token. Webhook not from Xendit.');
    }
  }

  async processWebhookEvent(event: any): Promise<void> {
    // This is the correct way to destructure the data from the Xendit payload
    const { external_id, status } = event; 
    console.log(external_id)
    this.logger.debug(`Processing event ${event.event} for order ${external_id}. Status: ${status}`);
    switch (status) {
      case 'PAID':
        this.logger.log(`✅ Payment successful for Order: ${external_id}. Fulfilling order...`);
        // Add your order fulfillment logic here
        break;

      case 'PENDING':
        this.logger.warn(`Payment is still pending for Order: ${external_id}. Waiting for payment...`);
        break;

      case 'EXPIRED':
        this.logger.warn(`❌ Payment expired for Order: ${external_id}.`);
        // Add your expiration handling logic here
        break;

      default:
        this.logger.warn(`Unhandled Xendit status: ${status} for Order: ${external_id}`);
    }
  }
}