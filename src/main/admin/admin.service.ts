import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getUserDTO } from './dto/get_all_user';

@Injectable()
export class AdminService {
  constructor(private prisma:PrismaService){}

  // get all user and using filter
  async findAllUser(filterDto:getUserDTO) {
      const {page=1,limit=10}=filterDto
     const skip=(page-1)*limit
     const take=limit
    const where:any={}
    if(filterDto.search){
      where.OR=[
        {name:{contains:filterDto.search,mode:"insensitive"}},
        {email:{contains:filterDto.search,mode:"insensitive"}},
        {role:{contains:filterDto.search,mode:"insensitive"}},
        {phone:{contains:filterDto.search,mode:"insensitive"}}
      ]
    }
    const res=await this.prisma.credential.findMany({
      where,
      skip,
      take,
      orderBy:{
        createdAt:"desc"
      }
    })
    return res;
  }


  // find single user for details
  async findOneUser(id:string) {
    if(!id){
      throw new BadRequestException("id is required")
    }
    const isExist=await this.prisma.credential.findFirst({
      where:{
        id
      }
    })
    if(!isExist){
      throw new BadRequestException("user not found")
    }
    return isExist
  }


// update user role
 async  updateRole(id: string, updateAdminDto: UpdateAdminDto) {
    if(!id){
      throw new BadRequestException("id is required")
    }

    if(!updateAdminDto.role){
      throw new BadRequestException("role is required")
    }

    const isExist=await this.prisma.credential.findFirst({
      where:{
        id
      }
    })
    if(!isExist){
      throw new BadRequestException("user not found")
    }
    if(isExist.role===updateAdminDto.role){
      throw new BadRequestException("role is already same")
    }
    const res=await this.prisma.credential.update({
      where:{
        id
      },
      data:{
        role:updateAdminDto.role
      }
    })
    return res
  }

  // delete user
  async removeUser(id:string) {
    if(!id){
      throw new BadRequestException("id is required")
    }
    const isExist=await this.prisma.credential.findFirst({
      where:{
        id
      }
    })
    if(!isExist){
      throw new BadRequestException("user not found")
    }
    const res=await this.prisma.credential.delete({
      where:{
        id
      }
    })
    return res
  }
}
