import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
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
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(stripeSecretKey, {
    
    });
  }


async createSubscription(dto: { priceId: string; customerEmail: string; paymentMethodId: string }) {
  const { priceId, customerEmail, paymentMethodId } = dto;

  // 1. Find or create customer
  const existingCustomers = await this.stripe.customers.list({ email: customerEmail, limit: 1 });
  const customerId = existingCustomers.data[0]?.id ?? (await this.stripe.customers.create({ email: customerEmail })).id;

  // 2. Attach payment method to customer
  await this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

  // 3. Set payment method as default for invoices
  await this.stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  // 4. Create subscription with payment_behavior: 'error_if_incomplete'
const subscription = await this.stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'error_if_incomplete',
  expand: ['latest_invoice.payment_intent'],
});

const latestInvoice = subscription.latest_invoice as Stripe.Invoice & { payment_intent?: Stripe.PaymentIntent };

const paymentIntent = latestInvoice.payment_intent;

if (!paymentIntent) {
  // No payment intent means payment is not needed now
  return {
    subscriptionId: subscription.id,
    clientSecret: null,
  };
}

return {
  subscriptionId: subscription.id,
  clientSecret: paymentIntent.client_secret,
};
}



  // Handle webhook
 async handleWebhook(req: any) {
    const webhookSecret = 'whsec_dKFgPLzF18VwqXGhjKCPlmG8OWHYKIxf';
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    // req.body must be raw buffer/string (configured in main.ts)
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice);
        // TODO: your business logic here
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  }
}
