import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StripPaymentService } from './strip-payment.service';
import { CreateStripPaymentDto } from './dto/create-strip-payment.dto';
import Stripe from 'stripe';
import { Request } from 'express';

@Controller('payment')
export class StripPaymentController {
  constructor(private readonly stripPaymentService: StripPaymentService) {}

  // ✅ Create a Payment Intent
  @Post('intent')
  async createPaymentIntent(@Body() createStripPaymentDto: CreateStripPaymentDto) {
    return this.stripPaymentService.createPaymentIntent(createStripPaymentDto);
  }

  // ✅ Stripe Webhook Endpoint
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req,
    @Headers('stripe-signature') sig: string,
  ) {
    const stripe = new Stripe('sk_test_51RpBlQCiM0crZsfwVk32w5zlltJXLprEkVvyD9TV79CH3BpVn4jooXv6sh9SaonXW7isHwY3rlqJifwquT4qJ3VO00wTyR0yYQ', {
    
    });

    const endpointSecret = 'whsec_3skigjeWzn7FBJ00wKNRbZPeNS9p6nrU';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody, // Required for Stripe webhook verification
        sig,
        endpointSecret,
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return { error: 'Invalid webhook signature' };
    }

    // ✅ Handle Stripe Events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
        await this.stripPaymentService.handleSuccessfulPayment(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.warn(`❌ Payment failed: ${paymentIntent.id}`);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`🔔 Checkout session completed. Status: ${session.payment_status}`);
        break;
      }

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
