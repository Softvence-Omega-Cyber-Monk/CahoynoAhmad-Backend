import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Http2ServerRequest } from 'http2';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
 async create(@Body() createAuthDto: CreateAuthDto) {
    try{
      const result=await this.authService.create(createAuthDto);
    return {
        statusCode:HttpStatus.CREATED,
        success:true,
        message: 'User created successfully',
        data: result
    }
    }catch(error){
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Post('login')
  async login(@Body() LoginDto: LoginDTO) {
    try{
      const result=await this.authService.login(LoginDto);
    return {
        statusCode:HttpStatus.OK,
        success:true,
        message: 'Login successful',
        data: result
    }
    }catch(error){
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
