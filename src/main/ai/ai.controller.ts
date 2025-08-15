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
} from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async create(@Body() createAiDto: CreateAiDto,@Request() req:any) {
    const user=req.user;
    createAiDto.session_id=user.userId;
    const response = await this.aiService.create(createAiDto);
    return {
      statusCode: 200,
      success: true,
      message: 'Ai created successfully',
      data: response,
    };
  }

  @Post('history')
  async getAllHistory(@Body() body:any) {
    const {session_id}=body;
    const response =await this.aiService.getAllHistory(session_id);
    return {
      statusCode: 200,
      success: true,
      message: 'History Retrive successfully',
      data: response,
    }
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
