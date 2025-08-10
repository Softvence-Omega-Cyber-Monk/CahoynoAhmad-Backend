import { Injectable } from '@nestjs/common';
import Stripe from 'stripe'; // Ensure you import Stripe correctly
import { ConfigService } from '@nestjs/config'; // Import ConfigService to access environment variables
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {});
  }

  async create(createStripeDto: any) {
    const plan = createStripeDto.plan;
    const month: string = createStripeDto.month;

    // Here i need to find the user according to give auth token then i can use userEmail
    const {  userEmail } = createStripeDto;

  // 1. Find or create a Stripe customer
  let customerId: string;
  const existingCustomers = await this.stripe.customers.list({ email: userEmail, limit: 1 });

  if (existingCustomers.data.length > 0) {
    // If a customer with this email already exists, use their ID
    customerId = existingCustomers.data[0].id;
  } else {
    // If not, create a new customer
    const newCustomer = await this.stripe.customers.create({
      email: userEmail,
      description: `Customer for ${userEmail}`,
    });
    customerId = newCustomer.id;
  }

    let priceId: string | undefined;

    // Determine the price ID based on the plan
    if (plan === 'PREMIUM') {
      if (month === '1') {
        priceId = this.configService.get<string>('PREMIUM_1_MONTH');
      } else if (month === '3') {
        priceId = this.configService.get<string>('PREMIUM_3_MONTH');
      } else if (month === '6') {
        priceId = this.configService.get<string>('PREMIUM_6_MONTH');
      } else {
        priceId = this.configService.get<string>('PREMIUM_12_MONTH');
      }
    } else if (plan === 'CORE PAID') {
      if (month === '1') {
        priceId = this.configService.get<string>('BASIC_1_MONTH');
      } else if (month === '3') {
        priceId = this.configService.get<string>('BASIC_3_MONTH');
      } else if (month === '6') {
        priceId = this.configService.get<string>('BASIC_6_MONTH');
      } else {
        priceId = this.configService.get<string>('BASIC_12_MONTH');
      }
    } else if (plan === 'SAVAGE MODE') {
      if (month === '1') {
        priceId = this.configService.get<string>('FREE_1_MONTH');
      } else if (month === '3') {
        priceId = this.configService.get<string>('FREE_3_MONTH');
      } else if (month === '6') {
        priceId = this.configService.get<string>('FREE_6_MONTH');
      } else {
        priceId = this.configService.get<string>('FREE_12_MONTH');
      }
    } else {
      throw new Error(`Unsupported plan: ${plan}`);
    }

    if (!priceId) {
      throw new Error(`No priceId found for plan: ${plan}`);
    }

    // Create a checkout session
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: `${this.configService.get<string>('CLIENT_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('CLIENT_URL')}/cancel`,
    });
    return {
      message: 'Payment session created successfully',
      sessionId: session.id,
      url: session.url,
    };
  }

  async findAll({ season_id }: { season_id: string }) {
    const result = await this.stripe.checkout.sessions.retrieve(season_id);
    return {
      message: 'Payment session retrieved successfully',
      session: result,
    };
  }

//   Handle webhook
  async handleWebhook(req: any, body: any) {
    console.log('form webhok', body);
    const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error(
        'STRIPE_WEBHOOK_SECRET is not defined in environment variables',
      );
    }
    const event = this.stripe.webhooks.constructEvent(
      body,
      req.headers['stripe-signature'],
      webhookSecret,
    );

    // Process the event
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout session completion
        console.log('Checkout session completed:', event.data.object);
        break;
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}
