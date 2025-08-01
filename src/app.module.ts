import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './main/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './main/user/user.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
  PrismaModule,
  AuthModule,
  UserModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
