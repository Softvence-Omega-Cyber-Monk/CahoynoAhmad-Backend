import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanService {
  constructor(private readonly prisma:PrismaService){}
  async create(createPlanDto: CreatePlanDto) {

    if(!createPlanDto.priceId){
      throw new NotFoundException("please enter the price id fist")
    }

    const res=await  this.prisma.plan.create({
     data:{
      name:createPlanDto.name,
      price:createPlanDto.price,
      description:createPlanDto.description,
      duration:createPlanDto.duration,
      features:createPlanDto.features,
      priceId:createPlanDto.priceId
     }
    })
      
      return res;
  }

 async findAll() {
      const res=await this.prisma.plan.findMany()
      return res;
  }

 

  async deletPlan(id:string) {
      try{
        if(!id){
          throw new NotFoundException("please enter the plan id")
        }
        const res=await this.prisma.plan.delete({
          where:{
            id:id
          }
        })
        return res;
      }catch(err){
        throw new HttpException(err.message, err.status)
      }
  }
}
