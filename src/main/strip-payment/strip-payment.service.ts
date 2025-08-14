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
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {});
  }
  async createSubscription(dto: {
    planInfo: any;
    customerEmail: string;
    paymentMethodId: string;
  }) {
    const { planInfo, customerEmail, paymentMethodId } = dto;
    console.log(planInfo)
    // 1. Find or create customer
    const existingCustomers = await this.stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    const customerId =
      existingCustomers.data[0]?.id ??
      (await this.stripe.customers.create({ email: customerEmail })).id;

    // 2. Attach payment method to customer
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // 3. Set payment method as default for invoices
    await this.stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  
    let priceId
    if(planInfo.plan==="HOT_MESS"||planInfo.blillingIntervel==="Monthly"){
      priceId=this.configService.get<string>('BASIC_MONTHLY')
    }else if(planInfo.plan==="HOT_MESS"||planInfo.blillingIntervel==="yearly"){
      priceId=this.configService.get<string>('PRO_PRICE_ID')
    }else if(planInfo.plan==="NO_FILTER"||planInfo.blillingIntervel==="Monthly"){
      priceId=this.configService.get<string>('PREMIUM_PRICE_ID')
    }else if(planInfo.plan==="NO_FILTER"||planInfo.blillingIntervel==="yearly"){
      priceId=this.configService.get<string>('ENTERPRISE_PRICE_ID')
    }else if(planInfo.plan==="SAVAGE_MODE"||planInfo.blillingIntervel==="Monthly"){
      priceId=this.configService.get<string>('FREE_PRICE_ID')
    }else if(planInfo.plan==="SAVAGE_MODE"||planInfo.blillingIntervel==="yearly"){
      priceId=this.configService.get<string>('FREE_PRICE_ID')
    }else if(planInfo.plan==="SIPTS_FOR_BRAND"||planInfo.blillingIntervel==="monthly"){
      priceId=this.configService.get<string>('FREE_PRICE_ID')
    }else if(planInfo.plan==="SIPTS_FOR_BRAND"||planInfo.blillingIntervel==="YEARLY"){
      priceId=this.configService.get<string>('FREE_PRICE_ID')
    }else if(planInfo.plan==="ONE_TIME-ROAST"||planInfo.blillingIntervel==="monthly"){
      priceId=this.configService.get<string>('FREE_PRICE_ID')
    }else if(planInfo.plan==="LIFE_TIME"||planInfo.blillingIntervel==="monthly"){
      priceId=this.configService.get<string>('FREE_PRICE_ID')
    }

    // 4. Create subscription with payment_behavior: 'error_if_incomplete'
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'error_if_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata:{
        userId:"cme7raknl0002v30gq5vvtjcf",
        SubscriptionName:"PRO",
        SubscriptionType:"Monthly",
        SubscriptionPrice:"$99.00",
        SubscriptionStatus:"Active",
      }
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice & {
      payment_intent?: Stripe.PaymentIntent;
    };

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
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':



        const invoice = event.data.object as Stripe.Invoice;
        
      const subscriptionId = invoice.parent?.subscription_details?.subscription;
        const invoiceId = invoice.id;
        const paymentData = {
          stripePaymentId: invoiceId,
          stripeInvoiceId: invoiceId,
          amount: invoice.amount_paid,
          currency: invoice.currency,

          status: invoice.status,
          email: invoice.customer_email,
          description: invoice.description,
          subscriptionId: 'Pro',
          userId: 'cme7raknl0002v30gq5vvtjcf',
          periodStart: invoice.period_start,
          periodEnd: invoice.period_end,
        };
        console.log(paymentData);
        // const result=await this.prisma.payment.create({
        //   data:{
        //     stripePaymentId:'1',
        //     amount:invoice.amount_paid,
        //     currency:invoice.currency,
        //     status:'paid',
        //   }
        // })

        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  }
}
