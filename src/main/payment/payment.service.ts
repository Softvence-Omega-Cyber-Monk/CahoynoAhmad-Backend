import {
  BadRequestException,
  HttpException,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  async makePayment(user: any) {
    const priceId = process.env.PRICE_ID;
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
    const season = await this.stripe.checkout.sessions.create({
      mode: price.recurring ? 'subscription' : 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: process.env.SUCCES_URL,
      cancel_url: process.env.CANCEL_URL,
      metadata: {
        userId: userExist.id,
        priceId: priceId,
      },
    });
    console.log(season.url);
    return season.url;
  }

  async handleWebhook(rawBody: Buffer | null, signature: string) {
    if (!rawBody) {
      throw new BadRequestException('No webhook payload was provided.');
    }

    let event: Stripe.Event;

    try {
      // construct the webhook event
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_KEY as string,
      );
    } catch (err: any) {
      console.error('Stripe signature verification failed:', err.message);
      throw new BadRequestException('Invalid Stripe signature');
    }

    // Handle important events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
          console.log(session)
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId;
          if (!userId) {
            console.warn('⚠️ Missing userId in metadata');
            break;
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
          // update user subscription
          await this.prisma.credential.update({
            where: {
              id: userId,
            },
            data: {
              subscription: 'PREMIUM',
            },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const userId = subscription.metadata?.userId;
        if (!userId) break;

        // Update user in DB after finish timeline of the subscription
        await this.prisma.credential.update({
          where: { id: userId },
          data: { subscription: 'FREE' },
        });

        console.log(`User ${userId} downgraded to FREE`);
        break;
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true };
  }
}
