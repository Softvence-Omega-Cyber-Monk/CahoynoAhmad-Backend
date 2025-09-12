// src/game/game.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@ApiTags('Game') // Swagger group name
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
    return this.gameService.findOne(id); // keep id as string (uuid)
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
}
