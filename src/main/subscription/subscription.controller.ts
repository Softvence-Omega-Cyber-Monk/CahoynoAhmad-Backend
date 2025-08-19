/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { RolesGuard } from 'src/utils/authorization/roles.guard';
import { Roles } from 'src/utils/authorization/roles.decorator';
import { Role } from 'src/utils/authorization/role.enum';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async createSubscription(
    @Body() SubscriptionDto: CreateSubscriptionDto,
    @Request() req
  ) {
    const subscription =
      await this.subscriptionService.createSubscription(SubscriptionDto);
    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async findAllSubscription() {
    const result = await this.subscriptionService.findAllSubscription();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Subscription fetched successfully',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const result = await this.subscriptionService.updateSubscription(
      id,
      updateSubscriptionDto,
    );
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Subscription updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    const result = this.subscriptionService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Subscription deleted successfully',
      data: result,
    };
  }
}
