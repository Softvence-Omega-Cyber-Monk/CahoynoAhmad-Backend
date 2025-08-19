/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
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

  // Plan mapping helper
  private getPriceId(plan: string, billingInterval: string): string {
    const planKey = `${plan}_${billingInterval.toUpperCase()}`;
    
    const priceMapping = {
      'HOT_MESS_MONTHLY':"price_1RuIseCiM0crZsfwqv3vZZGj",
      'HOT_MESS_YEARLY': this.configService.get<string>('HOT_MESS_YEARLY'),
      'NO_FILTER_MONTHLY': this.configService.get<string>('NO_FILTER_MONTHLY'),
      'NO_FILTER_YEARLY': this.configService.get<string>('NO_FILTER_YEARLY'),
      'SAVAGE_MODE_MONTHLY': this.configService.get<string>('SAVAGE_MODE_MONTHLY'),
      'SAVAGE_MODE_YEARLY': this.configService.get<string>('SAVAGE_MODE_YEARLY'),
      'SIPTS_FOR_BRAND_MONTHLY': this.configService.get<string>('SIPTS_FOR_BRAND_MONTHLY'),
      'SIPTS_FOR_BRAND_YEARLY': this.configService.get<string>('SIPTS_FOR_BRAND_YEARLY'),
      'ONE_TIME_ROAST': this.configService.get<string>('ONE_TIME_ROAST'),
      'LIFETIME_NO_FILTER': this.configService.get<string>('LIFETIME_NO_FILTER'),
      'LIFETIME_SAVAGE_MODE': this.configService.get<string>('LIFETIME_SAVAGE_MODE'),
    };

    return priceMapping[planKey] || null;
  }

  async createSubscription(dto: {
    planInfo: { plan: string; billingInterval: string };
    customerEmail: string;
    paymentMethodId: string;
    userId: string; // Add userId to DTO
  }) {
    const { planInfo, customerEmail, paymentMethodId, userId } = dto;

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

    // 4. Get the correct price ID
    const priceId = this.getPriceId(planInfo.plan, planInfo.billingInterval);
    
    if (!priceId) {
      throw new Error(`Invalid plan configuration: ${planInfo.plan} - ${planInfo.billingInterval}`);
    }

    // 5. Create subscription with correct price ID
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }], // Use dynamic price ID
      payment_behavior: 'error_if_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: userId,
        planType: planInfo.plan,
        billingInterval: planInfo.billingInterval,
      },
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
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

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
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    try {
      // Check if this is a subscription-related payment
      const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : null;
      
      // Save payment record
      const paymentData = {
        stripePaymentId: invoice.id || '',
        stripeInvoiceId: invoice.id || '',
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency.toUpperCase(),
        status: invoice.status || 'unknown',
        email: invoice.customer_email || '',
        description: invoice.description || '',
        subscriptionId: subscriptionId,
        periodStart: new Date((invoice.period_start || invoice.created) * 1000),
        periodEnd: new Date((invoice.period_end || invoice.created) * 1000),
      };

      let userId: string | null = null;
      let planType: string | null = null;

      // If it's a subscription payment, get subscription details
      if (subscriptionId) {
        try {
          const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
          userId = subscription.metadata?.userId || null;
          planType = subscription.metadata?.planType || null;
        } catch (error) {
          console.error('Error retrieving subscription:', error);
        }
      }

      // For one-time payments or if no subscription found, try to get userId from customer
      if (!userId && invoice.customer) {
        try {
          const customer = await this.stripe.customers.retrieve(invoice.customer as string);
          if (customer && !customer.deleted && customer.metadata?.userId) {
            userId = customer.metadata.userId;
            planType = 'ONE_TIME_ROAST'; // Default for one-time payments
          }
        } catch (error) {
          console.error('Error retrieving customer:', error);
        }
      }

      if (userId) {
        // Update user profile with subscription info (if applicable)
        if (planType && subscriptionId) {
          await this.updateUserSubscription(userId, subscriptionId, planType);
        }
        
        // Save payment with userId
        await this.prisma.payment.create({
          data: {
            ...paymentData,
            userId: userId,
          }
        });
      } else {
        // Save payment without userId if we can't determine it
        await this.prisma.payment.create({
          data: paymentData
        });
        console.warn('Could not determine userId for payment:', invoice.id);
      }

      console.log('Payment processed successfully:', paymentData);
    } catch (error) {
      console.error('Error handling payment succeeded:', error);
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    const planType = subscription.metadata?.planType;

    if (userId && planType) {
      await this.updateUserSubscription(userId, subscription.id, planType);
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    const planType = subscription.metadata?.planType;

    if (userId && planType) {
      await this.updateUserSubscription(userId, subscription.id, planType);
    }
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;

    if (userId) {
      // Reset to FREE plan
      await this.updateUserSubscription(userId, null, 'FREE');
    }
  }

  private async updateUserSubscription(
    userId: string,
    stripeSubscriptionId: string | null,
    planType: string
  ) {
    try {
      let subscriptionRecord: any = null;
      if (stripeSubscriptionId && planType !== 'FREE') {
        subscriptionRecord = await this.prisma.subscription.upsert({
          where: { 
           
            id: stripeSubscriptionId 
          },
          update: {
            planType: planType as any,
          },
          create: {
            id: stripeSubscriptionId,
            planType: planType as any,
            billingCycle: 'MONTHLY', 
            priceId: '',
            productId: '', 
            priceAmount: 0, 
            currency: 'USD',
            dailyGenerations: this.getDailyGenerations(planType),
            toneStylesAllowed: this.getToneStyles(planType),
            publicFeedAccess: this.getPublicFeedAccess(planType),
            communitySharing: this.getCommunitySharing(planType),
            postInteraction: this.getPostInteraction(planType),
          }
        });
      }

      // Update user profile
      await this.prisma.userProfile.update({
        where: { userId },
        data: {
          subscriptionName: planType,
          subscriptionId: subscriptionRecord?.id || null,
        }
      });

      console.log(`Updated user ${userId} subscription to ${planType}`);
    } catch (error) {
      console.error('Error updating user subscription:', error);
    }
  }

  // Helper methods to get plan features
  private getDailyGenerations(planType: string): number {
    const limits = {
      FREE: 5,
      HOT_MESS: 10,
      NO_FILTER: 50,
      SAVAGE_MODE: 200,
      SIPTS_FOR_BRAND: 1000,
      ONE_TIME_ROAST: 1,
      LIFETIME_NO_FILTER: 100,
      LIFETIME_SAVAGE_MODE: 500,
    };
    return limits[planType] || 5;
  }

  private getToneStyles(planType: string): number {
    const styles = {
      FREE: 3,
      HOT_MESS: 3,
      NO_FILTER: 8,
      SAVAGE_MODE: 15,
      SIPTS_FOR_BRAND: 25,
      ONE_TIME_ROAST: 5,
      LIFETIME_NO_FILTER: 10,
      LIFETIME_SAVAGE_MODE: 20,
    };
    return styles[planType] || 3;
  }

  private getPublicFeedAccess(planType: string): boolean {
    return !['FREE', 'ONE_TIME_ROAST'].includes(planType);
  }

  private getCommunitySharing(planType: string): boolean {
    return ['NO_FILTER', 'SAVAGE_MODE', 'SIPTS_FOR_BRAND', 'LIFETIME_NO_FILTER', 'LIFETIME_SAVAGE_MODE'].includes(planType);
  }

  private getPostInteraction(planType: string): boolean {
    return ['SAVAGE_MODE', 'SIPTS_FOR_BRAND', 'LIFETIME_NO_FILTER', 'LIFETIME_SAVAGE_MODE'].includes(planType);
  }
}