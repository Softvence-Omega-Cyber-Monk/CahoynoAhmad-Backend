import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getUserDTO } from './dto/get_all_user';
import { GetAllPaymentDto } from './dto/get.payment.dto';

@Injectable()
export class AdminService {
  constructor(private prisma:PrismaService){}

  async dashboard() {
  // === TOTAL COUNTS ===
  const totalUser = await this.prisma.credential.count();

  const totalSubscribeUser = await this.prisma.credential.count({
    where: { isSubscribe: true },
  });

  const totalUnSubscribeUser = totalUser - totalSubscribeUser;

  const registerUserByAffiliate = await this.prisma.credential.aggregate({
    _sum: { totalAffiliate: true },
  });

  const totalRevenue = await this.prisma.payment.aggregate({
    _sum: { amount: true },
  });

  // === DATES ===
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // === LAST MONTH'S COUNTS ===
  const lastMonthUsers = await this.prisma.credential.count({
    where: {
      createdAt: {
        gte: firstDayLastMonth,
        lte: lastDayLastMonth,
      },
    },
  });

  const lastMonthSubscribers = await this.prisma.credential.count({
    where: {
      isSubscribe: true,
      createdAt: {
        gte: firstDayLastMonth,
        lte: lastDayLastMonth,
      },
    },
  });

  const lastMonthRevenue = await this.prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: firstDayLastMonth,
        lte: lastDayLastMonth,
      },
    },
  });

  // === THIS MONTH'S COUNTS (for growth) ===
  const thisMonthUsers = await this.prisma.credential.count({
    where: {
      createdAt: {
        gte: firstDayThisMonth,
        lte: now,
      },
    },
  });

  const thisMonthSubscribers = await this.prisma.credential.count({
    where: {
      isSubscribe: true,
      createdAt: {
        gte: firstDayThisMonth,
        lte: now,
      },
    },
  });

  const thisMonthRevenue = await this.prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: firstDayThisMonth,
        lte: now,
      },
    },
  });

  // === CALCULATE GROWTH IN PERCENTAGE ===
  const calcGrowth = (current: number, prev: number) => {
    if (!prev || prev === 0) return current > 0 ? 100 : 0;
    return ((current - prev) / prev) * 100;
  };

  const userGrowth = calcGrowth(thisMonthUsers, lastMonthUsers);
  const subscriberGrowth = calcGrowth(thisMonthSubscribers, lastMonthSubscribers);
  const revenueGrowth = calcGrowth(
    thisMonthRevenue._sum.amount || 0,
    lastMonthRevenue._sum.amount || 0
  );

  // === RETURN FINAL DASHBOARD DATA ===
  return {
    totals: {
      totalUser,
      totalSubscribeUser,
      totalUnSubscribeUser,
      totalAffiliate: registerUserByAffiliate._sum.totalAffiliate || 0,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
    growth: {
      userGrowth: +userGrowth.toFixed(2),
      subscriberGrowth: +subscriberGrowth.toFixed(2),
      revenueGrowth: +revenueGrowth.toFixed(2),
    },
  };
}

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


  async paymentHistory(filterDto:GetAllPaymentDto) {
    const {page=1,limit=10}=filterDto
    const skip=(page-1)*limit
    const take=limit
    const res=await this.prisma.payment.findMany({
      skip,
      take,
      orderBy:{
        createdAt:"desc"
      }
    })
    return res
  }

  
// udpate user block or not by admin
  async blockOrOpenUser(id:string) {
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
    const res=await this.prisma.credential.update({
      where:{
        id
      },
      data:{
        isBlocked:!isExist.isBlocked
      }
    })
    return res
  }


  async updateAdminProfile(userId:string,dto:any,file:any){
    let imagerURL
      if(file){
         imagerURL = `${process.env.SERVER_BASE_URL}/uploads/${file.filename}`
      }
      const res=await this.prisma.credential.update({
        where:{
          id:userId
        },
        data:{
         name:dto.name,
         image:imagerURL,
         phone:dto.phone
        }
      })
      return res;

  }

  async createPrUser(userId:string){
    // console.log(userId)
    const isUserexit=await this.prisma.credential.findFirst({
      where:{
        id:userId
      }
    })
    if(!isUserexit){
      throw new NotFoundException("User not found")
    }
  const res=  await this.prisma.credential.update({
      where:{
        id:userId
      },
      data:{
        isSubscribe:true
      }
    })
    const res3=await this.prisma.payment.create({
      data:{
        userId:userId,
        amount:500,
        status:"PAID",
        planName:"PRO",
        planId:"2",
        userEmail:isUserexit.email
      }
    })
    return {
      user:res,
      paymet:res3
    }
  }
}
