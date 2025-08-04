import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/utils/authorization/roles.guard';
import { Roles } from 'src/utils/authorization/roles.decorator';
import { Role } from 'src/utils/authorization/role.enum';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.Admin)
  async createSubscription(@Body() SubscriptionDto: CreateSubscriptionDto,@Request() req) {
    const subscription=await this.subscriptionService.createSubscription(SubscriptionDto);
    return {
       statusCode:HttpStatus.CREATED,
       success:true,
       message:"Subscription created successfully",
       data:subscription
    }
  }

  @Get()
async findAllSubscription() {
    const result = await this.subscriptionService.findAllSubscription();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Subscription fetched successfully',
      data: result,
    }
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
