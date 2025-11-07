import {
  BadRequestException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  // For mobile in-app payments
  async createCheckoutSession(user: any,dto:CreatePaymentDto) {
    // const isExistPlan=await this.prisma.plan.findFirstOrThrow({
    //   where:{
    //     id:dto.planId,
    //     priceId:dto.priceId
    //   }
    // })
    // if(!isExistPlan){
    //   throw new HttpException('Plan not found', 404);
    // }

    const priceId = dto.priceId
    if (!priceId) {
      throw new HttpException('Price ID not configured', 500);
    }

    const userExist = await this.prisma.credential.findUnique({
      where: {
        id: user.userId,
      },
    });
    if (!userExist) {
      throw new HttpException('User not found', 404);
    }

    const price = await this.stripe.prices.retrieve(priceId);
    
    const session = await this.stripe.checkout.sessions.create({
      mode: price.recurring ? 'subscription' : 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // For mobile: use custom URL schemes or deep links
      success_url: 'yourapp://payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'yourapp://payment-cancel',
      metadata: {
        userId: userExist.id,
        priceId: priceId,
        planId:dto.planId,
        planName:dto.planName
      },
    });

    // console.log(session.url);
    
    // Return both URL and session ID for Flutter to handle
    return {
      url: session.url,
      sessionId: session.id,
    };
  }

  async handleWebhook(rawBody: Buffer | null, signature: string) {
    if (!rawBody) {
      throw new BadRequestException('No webhook payload was provided.');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_KEY as string,
      );
    } catch (err: any) {
      console.error('Stripe signature verification failed:', err.message);
      throw new BadRequestException('Invalid Stripe signature');
    }

    // Only handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session);

      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId;
        if (!userId) {
          console.warn('⚠️ Missing userId in metadata');
          return { received: true };
        }

        const amount = session.amount_total ? session.amount_total / 100 : 0;

        // Create payment record
        await this.prisma.payment.create({
          data: {
            userId,
            amount,
            status: 'Complete',
          },
        });

        // Update user subscription
        await this.prisma.credential.update({
          where: {
            id: userId,
          },
          data: {
            subscription: 'PREMIUM',
          },
        });

        console.log(`✅ Payment successful for user ${userId}`);
      }
    } else {
      console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true };
  }

  // Optional: Method for Flutter to verify payment status
  async verifyPaymentStatus(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        paymentStatus: session.payment_status,
        status: session.status,
        userId: session.metadata?.userId,
      };
    } catch (error) {
      throw new HttpException('Session not found', 404);
    }
  }
}