import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiBody({type:CreatePlanDto})
  
  // create plan 
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    try{
      return this.planService.create(createPlanDto);
    }catch(err){
      throw new HttpException(err.message, err.status)
    } 
  }

  // get all plan
  @Get()
  findAll() {
    try{
      return this.planService.findAll();
    }catch(err){
      throw new HttpException(err.message, err.status)
    }
  }


  // delet plan by  id
  @Delete(':id')
  remove(@Param('id') id: string) {
   try{
     return this.planService.deletPlan(id);
   }catch(err){
    throw new HttpException(err.message,err.status)
   }
  }
}
