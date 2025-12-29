import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, InternalServerErrorException } from '@nestjs/common';
import { ApplePurchaseService } from './apple-purchase.service';
import { CreateApplePurchaseDto } from './dto/create-apple-purchase.dto';
import { UpdateApplePurchaseDto } from './dto/update-apple-purchase.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('apple-purchase')
  @ApiBearerAuth()
export class ApplePurchaseController {
  constructor(private readonly applePurchaseService: ApplePurchaseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
async   createApplePushces(@Body() createApplePurchaseDto: CreateApplePurchaseDto, @Req() req:any) {
    try{
      const userId = req.user.userId;
    const res=await this.applePurchaseService.create(createApplePurchaseDto,userId);
      return {
        status:200,
        message:'Apple Purchase created successfully',
        data:res
      }
    }catch(error){
      throw new InternalServerErrorException(error.message,error.status)
    }
  }

  @Get('my-payment')
  async findAll(@Req() req:any) {
    try{
      const userId = req.user;
      console.log(userId);
      const res=await this.applePurchaseService.findAll(userId);
      return {
        status:200,
        message:'Apple Purchase created successfully',
        data:res
      }
    }catch(error){
      throw new InternalServerErrorException(error.message, error.status)
    }
  } 

}
