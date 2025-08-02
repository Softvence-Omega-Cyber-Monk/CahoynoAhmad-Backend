import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body() createContactDto: CreateContactDto) {
    try {
      const result = await this.contactService.sendMessage(createContactDto);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Message sent successfully',
        data: result,
      };
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to send message',
        error: err.message,
      };
    }
  }
}
