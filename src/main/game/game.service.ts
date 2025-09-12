// src/game/game.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {
    return this.prisma.gameData.create({
      data: createGameDto,
    });
  }

  async findAll() {
    return this.prisma.gameData.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const game = await this.prisma.gameData.findUnique({
      where: { id },
    });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    const game = await this.prisma.gameData.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    return this.prisma.gameData.update({
      where: { id },
      data: updateGameDto,
    });
  }

  async remove(id: string) {
    const game = await this.prisma.gameData.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    return this.prisma.gameData.delete({
      where: { id },
    });
  }
}
