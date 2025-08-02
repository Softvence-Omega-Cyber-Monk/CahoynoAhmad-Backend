import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}
  async sendMessage(createContactDto: CreateContactDto) {
    try {
      const result = await this.mailService.sendMail({
        to: process.env.SMTP_USER as string,
        subject: 'Contact Message',
        html: `<h1>Name: ${createContactDto.name}</h1><h1>Email: ${createContactDto.email}</h1><h3>Message: ${createContactDto.message}</h3>`,
        from: process.env.SMTP_USER as string,
      });
    } catch (err) {
      throw new Error('Failed to create contact');
    }
  }
}
