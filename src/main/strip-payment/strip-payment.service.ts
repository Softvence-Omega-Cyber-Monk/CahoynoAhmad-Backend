import { Injectable } from '@nestjs/common';
import { CreateStripPaymentDto } from './dto/create-strip-payment.dto';
import { UpdateStripPaymentDto } from './dto/update-strip-payment.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StripPaymentService {
  private stripe: Stripe;

  constructor( private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    })   }

  async createPaymentIntent(createStripPaymentDto: CreateStripPaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: createStripPaymentDto.amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      link:paymentIntent
    };
  }

  async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  // Example: save to DB
  await this.prisma.payment.create({
    data: {
      stripePaymentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      email: paymentIntent.receipt_email,
    },
  });
}

  findAll() {
    return `This action returns all stripPayment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripPayment`;
  }

  update(id: number, updateStripPaymentDto: UpdateStripPaymentDto) {
    return `This action updates a #${id} stripPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripPayment`;
  }
}
