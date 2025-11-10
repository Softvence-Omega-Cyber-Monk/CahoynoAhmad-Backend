import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Xendit } from 'xendit-node';
import { CreateXenditPaymentDto } from './dto/create-xendit-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class XenditPaymentService {
  private readonly logger = new Logger(XenditPaymentService.name);
  private xenditClient: Xendit;
  private webhookToken: string;

  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secretKey = process.env.XENDIT_SECRET_KEY;
    this.webhookToken = process.env.XENDIT_CALLBACK_TOKEN!;

    if (!secretKey) {
      this.logger.error('XENDIT_SECRET_KEY not configured.');
      throw new InternalServerErrorException('Payment gateway not configured.');
    }

    this.xenditClient = new Xendit({ secretKey });
  }

  async createInvoice(dto: CreateXenditPaymentDto) {
    const externalId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const successUrl = this.configService.get('APP_BASE_URL') + '/payment/success';
    const failureUrl = this.configService.get('APP_BASE_URL') + '/payment/failure';

    try {

      const isExistUser=await this.prisma.credential.findFirst({
        where:{
          email:dto.email
        }
      })
      if(!isExistUser){
        throw new NotFoundException('User with this email does not exist.');
      }
      this.logger.log(`Creating Xendit invoice for ${dto.amount} with external_id: ${externalId}`);

      const invoice = await this.xenditClient.Invoice.createInvoice({
        data: {
          externalId,
          amount: dto.amount,
          description: dto.description,
          payerEmail: dto.email,
          successRedirectUrl: successUrl,
          failureRedirectUrl: failureUrl,
          currency: dto.currency,
          // metadata: {
          //   planId: 'PLAN-001', // Example static planId
          //   planName: 'Pro Plan',
          //   // planId:dto.planId
          //   // ...(dto.metadata ? JSON.parse(dto.metadata) : {}),
          //   // ...(dto.planId && { planId: dto.planId }),
          //   // ...(dto.planName && { planName: dto.planName }),
          // },
        },
      });

      this.logger.log(`Xendit Invoice created successfully. ID: ${invoice.id}`);
      return {
        success: true,
        invoiceUrl: invoice.invoiceUrl,
        externalId: invoice.externalId,
        xenditId: invoice.id,
      };
    } catch (error) {
      // this.logger.error('Xendit API Error:', error.message, error.stack);
      throw new HttpException(error.message, error.statusCode || 500);
    }
  }

  validateWebhookSignature(receivedToken: string): void {
    if (!receivedToken || receivedToken !== this.webhookToken) {
      throw new UnauthorizedException('Invalid X-Callback-Token. Webhook not from Xendit.');
    }
  }

  /**
   * Processes the Xendit webhook event, safely extracting and parsing metadata.
   */
  async processWebhookEvent(event: any): Promise<void> {
    const { external_id, status, payer_email, amount, metadata: rawMetadata } = event;
    let metadata = {};
    if (typeof rawMetadata === 'string' && rawMetadata.length > 0) {
      try {
        metadata = JSON.parse(rawMetadata);
        console.log(metadata,"fronm webhook")
      } catch (e) {
        this.logger.error(`Failed to parse metadata string for Order: ${external_id}`, e.stack);
      }
    } else if (typeof rawMetadata === 'object' && rawMetadata !== null) {
      metadata = rawMetadata;
    }
    const { planId, planName } = metadata as { planId?: string; planName?: string };
    console.log(metadata,"fronm webhook")
    this.logger.debug(`Processing event ${event.event} for order ${external_id}. Status: ${status}, Plan: ${planName}`);
    
    switch (status) {
      case 'PAID':
        this.logger.log(`✅ Payment successful for Order: ${external_id}`);
        
        try {
          await this.prisma.payment.create({
            data: {
              userEmail: payer_email,
              amount,
              status,
              // These will be undefined if not found, which is safe for the DB
              planId,
              planName,
            },
          });
          // Use updateMany when filtering by non-unique fields like email
          const updateResult = await this.prisma.credential.updateMany({
            where: {
              email: payer_email,
            },
            data: {
              isSubscribe: true,
              subscription: planName || 'PREMIUM',
            },
          });
          console.log(updateResult)
          if (updateResult.count === 0) {
            this.logger.warn(`No credential found for email ${payer_email} to update subscription status.`);
          }
          this.logger.log(`Payment record created for ${payer_email}. Plan: ${planName}`);

        } catch (err) {
          this.logger.error('Failed to save payment to DB', err.stack);
        }
        break;

      case 'PENDING':
        this.logger.warn(`Payment is still pending for Order: ${external_id}`);
        break;

      case 'EXPIRED':
        this.logger.warn(`❌ Payment expired for Order: ${external_id}`);
        break;

      default:
        this.logger.warn(`Unhandled Xendit status: ${status} for Order: ${external_id}`);
    }
  }
}