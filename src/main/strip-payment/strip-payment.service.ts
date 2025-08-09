import { Injectable } from '@nestjs/common';
import Stripe from 'stripe'; // Ensure you import Stripe correctly
import { ConfigService } from '@nestjs/config'; // Import ConfigService to access environment variables
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StripeService {
    private stripe: Stripe; 

    constructor(private readonly configService: ConfigService,private prisma:PrismaService) {
        const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
        }
        this.stripe = new Stripe(stripeSecretKey, {
           
        });
    }

    async create(createStripeDto: any) {
        const plan = 'PREMIUM'; 
        let priceId: string | undefined;

        // Determine the price ID based on the plan
        if (plan === 'PREMIUM') {
            priceId = 'price_1RsqclCiM0crZsfwUtOshc09';
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
            success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}', 
            cancel_url: 'https://example.com/cancel',
        });
        return { message: 'Payment session created successfully', sessionId: session.id ,url:session.url };
    }

    async findAll({ season_id }: { season_id: string }) {  
     const result=await this.stripe.checkout.sessions.retrieve(season_id)
        return { message: 'Payment session retrieved successfully', session: result };
    }

    async handleWebhook(req: any, body: any) {
      console.log('form webhok',body)
        const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
        }
        const event = this.stripe.webhooks.constructEvent(
            body,
            req.headers['stripe-signature'],
            webhookSecret
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