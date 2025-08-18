import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
