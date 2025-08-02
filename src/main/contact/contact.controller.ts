import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body() createContactDto: CreateContactDto) {
    try{
      const result=await  this.contactService.sendMessage(createContactDto);
      return {
        statusCode:HttpStatus.OK,
        success:true,
        message:'Message sent successfully',
        data: result,
      }
    }catch(err){
      return{
        statusCode:HttpStatus.INTERNAL_SERVER_ERROR,
        success:false,
        message:'Failed to send message',
        error: err.message,
      }
    }
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
