import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { getUserDTO } from './dto/get_all_user';
import { ApiOperation } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
}
