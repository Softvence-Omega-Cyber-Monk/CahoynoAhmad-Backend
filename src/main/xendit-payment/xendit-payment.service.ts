// src/xendit-payment/xendit-payment.service.ts

import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateXenditPaymentDto } from './dto/create-xendit-payment.dto';
import { CreateWithdrawalRequestDto } from './dto/createWithdrawRequest.dto';
import { GetWithdrawlsDto } from './dto/getWithdrawls.dto';

@Injectable()
export class XenditPaymentService {
  private readonly logger = new Logger(XenditPaymentService.name);
  private webhookToken: string;

  constructor(private readonly prisma: PrismaService) {
    this.webhookToken = process.env.XENDIT_CALLBACK_TOKEN as any;

    if (!process.env.XENDIT_SECRET_KEY) {
      this.logger.error('XENDIT_SECRET_KEY not configured.');
      throw new InternalServerErrorException('Payment gateway not configured.');
    }
  }

  // ================= Payment / Invoice =================
  async createInvoice(dto: CreateXenditPaymentDto, email: string) {
    const externalId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const successUrl = process.env.APP_BASE_URL + '/payment/success';
    const failureUrl = process.env.APP_BASE_URL + '/payment/failure';

    try {
      const user = await this.prisma.credential.findFirst({ where: { email } });
      if (!user) throw new NotFoundException('User with this email does not exist.');

      this.logger.log(`Creating Xendit invoice for ${dto.amount} with external_id: ${externalId}`);

      const response = await axios.post(
        'https://api.xendit.co/invoices',
        {
          external_id: externalId,
          amount: dto.amount,
          description: dto.description,
          payer_email: email,
          success_redirect_url: successUrl,
          failure_redirect_url: failureUrl,
          currency: dto.currency,
        },
        {
          auth: { username: process.env.XENDIT_SECRET_KEY!, password: '' },
        },
      );

      const invoice = response.data;

      return {
        success: true,
        invoiceUrl: invoice.invoice_url,
        externalId: invoice.external_id,
        xenditId: invoice.id,
      };
    } catch (error: any) {
      throw new HttpException(error.response?.data || error.message, error.response?.status || 500);
    }
  }

  // ================= Webhook =================
  validateWebhookSignature(receivedToken: string) {
    if (!receivedToken || receivedToken !== this.webhookToken) {
      throw new UnauthorizedException('Invalid X-Callback-Token. Webhook not from Xendit.');
    }
  }

  async processWebhookEvent(event: any) {
    const { status, payer_email, amount, metadata: rawMetadata } = event;
    let metadata: any = {};

    if (typeof rawMetadata === 'string') {
      try {
        metadata = JSON.parse(rawMetadata);
      } catch {}
    } else if (typeof rawMetadata === 'object') metadata = rawMetadata;

    const { planId, planName } = metadata;

    if (status === 'PAID') {
      try {
        await this.prisma.payment.create({
          data: { userEmail: payer_email, amount, status, planId, planName },
        });

        await this.prisma.credential.updateMany({
          where: { email: payer_email },
          data: { isSubscribe: true, subscription: planName || 'PREMIUM' },
        });

        this.logger.log(`Payment successful for ${payer_email}`);
      } catch (err) {
        this.logger.error('Failed to save payment to DB', err.stack);
      }
    } else {
      this.logger.warn(`Unhandled payment status: ${status}`);
    }
  }

  // ================= Withdrawal =================
  async createWithdrawlRequst(dto: CreateWithdrawalRequestDto, userId: string) {
    const user = await this.prisma.credential.findFirst({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    if (user.total_earnings < dto.amount) throw new BadRequestException('Insufficient balance');

    if(user.total_earnings<500){
      throw new BadRequestException('Minimum withdrawal amount is 500');
    }
    return this.prisma.withdrawalRequest.create({ data: { ...dto, userId } });
  }

  async acceptWithdrawRequestManual(withdrawalId: string, adminId: string) {
  const request = await this.prisma.withdrawalRequest.findUnique({
    where: { id: withdrawalId },
    include: { user: true },
  });
  
  if (!request) throw new NotFoundException('Withdrawal request not found');
  if (request.status !== 'PENDING') throw new BadRequestException('Request is not pending');

  // Mark as PROCESSING (optional)
  await this.prisma.withdrawalRequest.update({
    where: { id: withdrawalId },
    data: { status: 'PROCESSING' },
  });

  // Admin gives money manually here (outside app)

  // Mark as SUCCESS after transfer
  await this.prisma.withdrawalRequest.update({
    where: { id: withdrawalId },
    data: {
      status: 'SUCCESS',
      xenditId: null, // no Xendit involved
      failureMessage: null,
    },
  });

  return { success: true, message: 'Withdrawal manually processed' };
 }


  //* Get withdrawls
  async getWithdrawals(filter:GetWithdrawlsDto) {
    const {page=1,limit=10,status}=filter
    const skip=(page-1)*limit
    const where:any={}
    if(status){
      where.status=status
    }
    return this.prisma.withdrawalRequest.findMany({ 
      where,
      skip,
      take:Number(limit),
      orderBy:{createdAt:'desc'},
      include: { user: true } 
    });
  }

  //* withdrawl history
  async getMyWithdrawlHistory(userId:string){
    return this.prisma.withdrawalRequest.findMany({
      where:{userId},
      orderBy:{createdAt:'desc'}
    })
  }
}
