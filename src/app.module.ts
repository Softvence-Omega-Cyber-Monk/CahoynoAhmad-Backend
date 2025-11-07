import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './main/auth/auth.module';
import { UserModule } from './main/user/user.module';
import { MailModule } from './main/mail/mail.module';

import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryService } from './main/cloudinary/cloudinary.service';
import { QuranModule } from './main/quran/quran.module';
import { PaymentModule } from './main/payment/payment.module';
import { GameModule } from './main/game/game.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuestModule } from './main/quest/quest.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppInitializerService } from './main/quest/appInitealizerService';
import { XenditPaymentModule } from './main/xendit-payment/xendit-payment.module';
import { AdminModule } from './main/admin/admin.module';
import { SeederService } from './main/seed/seeder.service';
import { PlanModule } from './main/plan/plan.module';

@Module({
  imports: [
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/api/uploads'
    }),
    ConfigModule.forRoot({ isGlobal: true }),
     ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    QuranModule,
    PaymentModule,
    GameModule,
    QuestModule,
    XenditPaymentModule,
    AdminModule,
    PlanModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService,AppInitializerService,SeederService],
})
export class AppModule {}
