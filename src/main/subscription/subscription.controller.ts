import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createSubscription(@Body() SubscriptionDto: CreateSubscriptionDto,@Request() req) {
    console.log(req.user)
    console.log(SubscriptionDto)
    const subscription=await this.subscriptionService.createSubscription(SubscriptionDto);
    return {
       statusCode:HttpStatus.CREATED,
       success:true,
       message:"Subscription created successfully",
       data:subscription
    }
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }
}
