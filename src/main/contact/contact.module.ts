import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, MailService],
})
export class ContactModule {}
