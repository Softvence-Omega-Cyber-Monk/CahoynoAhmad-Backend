import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createSubscribeDto: CreateSubscribeDto, @Req() req: any) {
    const user = req.user;
    const response=await this.subscribeService.create(createSubscribeDto, user);
    return {
      statusCode: 200,
      success:true,
      message: 'Subscribe successfully',
      data: response,
    }
  }

  @Get()
async  findAll() {
    const response=await this.subscribeService.findAll();
    return {
      statusCode: 200,
      success:true,
      message: 'Subscribe list',
      data: response,
    }
  }


  @Delete(':id')
async  remove(@Param('id') id: string) {
    const response=await this.subscribeService.remove(id);
    return {
      statusCode: 200,
      success:true,
      message: 'Subscribe delete successfully',
      data: response,
    }
  }
}
