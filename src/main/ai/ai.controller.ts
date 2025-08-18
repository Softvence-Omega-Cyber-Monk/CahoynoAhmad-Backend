import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async create(@Body() createAiDto: CreateAiDto, @Request() req: any) {
    const user = req.user;
    const userProfile = await this.prisma.userProfile.findFirst({
      where: {
        userId: user.userId,
      },
    });
    createAiDto.session_id = user.userId;
    createAiDto.user_plan = userProfile?.subscriptionName as string;
    const response = await this.aiService.create(createAiDto);
    return {
      statusCode: 200,
      success: true,
      message: 'Ai created successfully',
      data: response,
    };
  }

  @Post('history')
  async getAllHistory(@Req() req: any) {
    const response = await this.aiService.getAllHistory(req.user);
    return {
      statusCode: 200,
      success: true,
      message: 'History Retrive successfully',
      data: response,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiDto: UpdateAiDto) {
    return this.aiService.update(+id, updateAiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiService.remove(+id);
  }
}
