// src/game/game.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { QuestType } from 'generated/prisma';


@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game question' })
  @ApiResponse({ status: 201, description: 'Game question created successfully' })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all game questions' })
  @ApiResponse({ status: 200, description: 'List of game questions' })
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single game question by ID' })
  @ApiResponse({ status: 200, description: 'Game question found' })
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game question by ID' })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game question by ID' })
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
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
    const userId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quests = await this.gameService['prisma'].userQuest.findMany({
      where: {
        userId,
        quest: { type: QuestType.DAILY },
        assignedAt: { gte: today },
      },
      include: { quest: true },
    });
    return quests;
  }

  @Get('quests/weekly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user\'s weekly quests for the current week' })
  @ApiResponse({ status: 200, description: 'List of weekly quests for the user' })
  async getWeeklyQuests(@Req() req: any) {
    const userId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const quests = await this.gameService['prisma'].userQuest.findMany({
      where: {
        userId,
        quest: { type: QuestType.WEEKLY },
        assignedAt: { gte: startOfWeek },
      },
      include: { quest: true },
    });
    return quests;
  }
}