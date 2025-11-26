// src/game/game.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, HttpStatus, HttpException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { QuestType } from 'generated/prisma';
import { DuaDto } from './dto/createDua.dto';
import { GetGameDto } from './dto/getGame.dto';


@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game question' })
  @ApiResponse({ status: 201, description: 'Game question created successfully' })
  create(@Body() createGameDto: CreateGameDto) {
    try{
      return this.gameService.create(createGameDto);
    }catch(err){
      throw new HttpException(err.message, err.status)
    }
  }

 @Post('bulk')
  @ApiOperation({ summary: 'Create multiple game questions in bulk' })
  @ApiResponse({ status: 201, description: 'Bulk game questions created successfully' })
  async createBulk(createGameDtos: CreateGameDto[]) {
    try{
      return await this.gameService.createBulk();
    }catch(err){
      throw new HttpException(err.message,err.status)
    }
  }
 @Delete('bulk')
  @ApiOperation({ summary: 'Delete all game questions' })
  @ApiResponse({ status: 200, description: 'All game questions deleted successfully' })
  async deleteAll() {
    try{
      return await this.gameService.deleteBulkGame();
    }catch(err){
      throw new HttpException(err.message, err.status)
    }
  }


  @Get()
  @ApiOperation({ summary: 'Get all game questions' })
  @ApiResponse({ status: 200, description: 'List of game questions' })
  findAll(@Query() filter:GetGameDto) {
    return this.gameService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single game question by ID' })
  @ApiResponse({ status: 200, description: 'Game question found' })
  findOne(@Param('id') id: string) {
    try{
      return this.gameService.findOne(id);
    }catch(err){
      throw new HttpException(err.message, err.status)
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game question by ID' })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    try{
      return this.gameService.update(id, updateGameDto);
    }catch(err){
      throw new HttpException(err.message, err.status)
    
    }
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game question by ID' })
  remove(@Param('id') id: string) {
    try{
      return this.gameService.remove(id);
    }catch(err){
      throw new HttpException(err.message, err.status)
    }
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit an answer for a question' })
  @ApiQuery({ name: 'answer', description: 'The selected answer', type: String })
  async submitAnswer(
    @Param('id') gameId: string,
    @Req() req: any,
    @Query('answer') answer: string,
  ) {
    try {
      const user = req.user;
      const res = await this.gameService.submitAnswer(user.userId, gameId, answer);
      return {
        statusCode: HttpStatus.OK,
        message: 'Answer submitted successfully',
        data: res,
      };
    } catch (error) {
      let Message = error?.message || 'Unexpected error';
      if (Message.includes('\n')) {
        Message = Message.split('\n').pop().trim();
      }
      return {
        statusCode: error.status,
        Message,
      };
    }
  }

@Get('quests/daily')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get a user\'s daily quests for today' })
@ApiResponse({ status: 200, description: 'List of daily quests for the user' })
async getDailyQuests(@Req() req: any) {
  try {
    const userId = req.user.userId;
    const quests = await this.gameService.getDailyQuests(userId);
    return {
      statusCode: 200,
      message: 'Daily quests fetched successfully',
      data: quests,
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      message: error.message || 'Unexpected error',
    };
  }
}

@Get('quests/weekly')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get a user\'s weekly quests for the current week' })
@ApiResponse({ status: 200, description: 'List of weekly quests for the user' })
async getWeeklyQuests(@Req() req: any) {
  try {
    const userId = req.user.userId;
    const quests = await this.gameService.getWeeklyQuests(userId);
    return {
      statusCode: 200,
      message: 'Weekly quests fetched successfully',
      data: quests,
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      message: error.message || 'Unexpected error',
    };
  }
}



  @Get('dua/get-all-posted-dua')
  async getAllDua(){
    try{
    const res=await this.gameService.getAllDua();
    return{
      statusCode:HttpStatus.OK,
      message:"Successfully fetched all dua",
      data:res
    }
    }catch(error){
      throw new InternalServerErrorException(error.message,error.status)
    }
  }

  @Post('dua/post-dua')
  @ApiBody({
    type:DuaDto
  })
  async postDua(@Body() dto:DuaDto){
    try{
      const res=await this.gameService.postDua(dto)
      return{
        statusCode:HttpStatus.CREATED,
        message:"Dua created successfully",
        data:res
      }
    }catch(error){
      throw new InternalServerErrorException(error.message, error.status)
    }
  }

 @Post('dua/create-all-dua')
  async createAllDua(){
    try{
      const res=await this.gameService.createAllDua()
      return{
        statusCode:HttpStatus.CREATED,
        message:"All dua created successfully",
        data:res
      }
    }catch(error){
      throw new InternalServerErrorException(error.message, error.status)
    }
  }


  @Get('dua/get-gameByDua/:duaName')
  @ApiParam({
      name: 'duaName',
      description: 'The name of the Dua niyah',
      example: 'niyah',
      type: String,
    })
  async getGameByDua(@Param('duaName') duaName:string){
    try{
      const res=await this.gameService.getGameByDua(duaName)
      return{
        statusCode:HttpStatus.OK,
        message:"Successfully fetched game data",
        data:res
      }
      
  }catch(error){
    throw new InternalServerErrorException(error.message, error.status)
  }
}


@Delete('dua/delete-duaTable')
async deleteDuaTable(){
  try{
    const res=await this.gameService.deleteDuaTable()
    return{
      statusCode:HttpStatus.OK,
      message:res.message,
    }
  }catch(error){
    throw new InternalServerErrorException(error.message, error.status)
  }
}


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Patch('complete-mission/:missionId')
async completeQuest(@Param('missionId') missionId:string,@Req() req:any,){
  try{
    const res=await this.gameService.completeUserMission(req.user.userId,missionId)
    return{
      statusCode:HttpStatus.OK,
      message:res.message,
      data:res.data
    }
  }catch(error){
    throw new InternalServerErrorException(error.message, error.status)
  }
}
}