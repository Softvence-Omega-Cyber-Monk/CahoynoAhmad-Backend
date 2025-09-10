import { BadRequestException, HttpException, Injectable, RawBodyRequest } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  private stripe:Stripe
  constructor(private prisma:PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  async makePayment(user:any) {
    const priceId=process.env.PRICE_ID
    if(!priceId){
      throw new HttpException("Price ID not configured",500)
    }
    const userExist=await this.prisma.credential.findUnique({
      where:{
        id:user.userId
      }
    })
    if(!userExist){
      throw new HttpException("User not found",404)
    }
    const price = await this.stripe.prices.retrieve(priceId);
    const season=await this.stripe.checkout.sessions.create({
      mode: price.recurring ? 'subscription' : 'payment',
      line_items:[
        {
          price:priceId,quantity:1
        }
      ],
      success_url:'http://localhost:3000/success',
      cancel_url:'http://localhost:3000/cancel',
      metadata:{
        userId:userExist.id,
        priceId:priceId
      }
    })
    return{
      url:season.url
    }
  }


   async handleWebhook(req: RawBodyRequest<Request>) {
    let event: Stripe.Event;
    const rawBody = req.rawBody;
    console.log(rawBody);
    const signature = req.headers['stripe-signature'] as string;
    if (!rawBody) {
      throw new BadRequestException('No webhook payload was provided.');
    }

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        'whsec_xCqIv09l79FgqbcoMRXjJwdDBNngRfON',
      );
    } catch {
      throw new BadRequestException('Invalid Stripe signature');
    }

    //  Handle important events
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          console.log('💰 Payment success:');
          console.log(
            '💰 Payment success:',
            session.id,
            session.customer_email,
          );
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;
          const planDuration = parseInt(
            session.metadata?.planDuration || '1',
            10,
          );
          if (!userId || !planId) {
            console.warn(
              '⚠️ Missing metadata: cannot create subscription record',
            );
            return;
          }
          const startDate = new Date();
          // End date = startDate + planDuration years
          const endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + planDuration);
          await this.prisma.credential.update({
            where: { id: userId },
            data: {
             isSubscribe:true
            },
          });

          await this.prisma.payment.create({
            data: {
              userId: userId,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              status: 'SUCCESS',
            },
          });
        }
        break;

      case 'invoice.payment_succeeded':
        console.log('✅ Subscription renewed');
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed');
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return { received: true };
  }
}
