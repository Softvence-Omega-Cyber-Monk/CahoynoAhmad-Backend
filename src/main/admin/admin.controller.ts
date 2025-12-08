import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Query, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { getUserDTO } from './dto/get_all_user';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { RolesGuard } from 'src/utils/authorization/roles.guard';
import { Roles } from 'src/utils/authorization/roles.decorator';
import { Role } from 'src/utils/authorization/role.enum';
import { GetAllPaymentDto } from './dto/get.payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  // platform stat
  @Get('dashboard')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({summary:"all stat of this platfrom"})
  async dashboard() {
    try{
      const res=await this.adminService.dashboard();
      return{
        status:HttpStatus.ACCEPTED,
        message:"all user retrive success",
        data:res
      }
    }catch(e){
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

@UseGuards(JwtAuthGuard,RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('payment-history')
  @ApiOperation({summary:"get all payment history"})
  async paymentHistory(@Query() filterDto:GetAllPaymentDto) {
    try{
      const res=await this.adminService.paymentHistory(filterDto);
      return{
        status:HttpStatus.ACCEPTED,
        message:"all payment history retrive success",
        data:res
      }
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch('update-profile')
@ApiConsumes('multipart/form-data') 
@UseGuards(JwtAuthGuard,RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
@ApiOperation({ summary: 'Update admin Profile' })
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      phone: { type: 'string' },
      file: { type: 'string', format: 'binary' },
    },
  },
})
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `quran-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }),
)
async updateAdminProfile(
  @Req() req: any,
  @Body() updateAdminDto: any,
  @UploadedFile() file: Express.Multer.File,
) {
  try {
    const id = req.user.userId;
    const res = await this.adminService.updateAdminProfile(id, updateAdminDto, file);
    return {
      status: HttpStatus.ACCEPTED,
      message: 'Admin profile updated successfully',
      data: res,
    };
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}
  // get all user by admin
  @Get('user')
  @ApiOperation({summary:"get all user and manage search"})
  async findAll(@Query() filterDto:getUserDTO) {
    try{
    
     const res=await this.adminService.findAllUser(filterDto);
     return{
      status:HttpStatus.ACCEPTED,
      message:"all user retrive success",
      data:res
     }
    }catch(e){
      throw new HttpException(e.message,HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  @ApiOperation({summary:"get single user"})
  async findOneUser(@Param('id') id: string) {
    try{
      const res=await this.adminService.findOneUser(id);
      return{
        status:HttpStatus.ACCEPTED,
        message:"user retrive success",
        data:res
      }
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  async update_role(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    try{
      const res=await this.adminService.updateRole(id, updateAdminDto);
      return{
        status:HttpStatus.ACCEPTED,
        message:"user role update success",
        data:res
      }
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':id')
  @ApiOperation({summary:"delete user by admin"})
  async removeUser(@Param('id') id: string) {
    try{
      const res=await this.adminService.removeUser(id);
      return{
        status:HttpStatus.ACCEPTED,
        message:"user delete success",
        data:res
      }
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }


  @Patch('block/:id')
  @ApiOperation({summary:"block user by admin"})
  async blockUser(@Param('id') id: string) {
    try{
      const res=await this.adminService.blockOrOpenUser(id);
      return{
        status:HttpStatus.ACCEPTED,
        message:"user blocked success",
        data:res
      }
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }


  @Post('test-primeum-user/:userID')
 
async createPrUser(@Param('id') userId:string){
try{
      const res=await this.adminService.createPrUser(userId);
      return{
        status:HttpStatus.ACCEPTED,
        message:"user blocked success",
        data:res
      }
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
}
}
