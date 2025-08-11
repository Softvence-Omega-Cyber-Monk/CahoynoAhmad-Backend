import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import type { Request } from 'express';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  // Create Reaction
  @UseGuards(JwtAuthGuard)
  @Post()
  async createReaction(
    @Body() createReactionDto: CreateReactionDto,
    @Req() req: Request,
  ) {
    try {
      const result = await this.reactionService.reactToPost(
        createReactionDto,
        req.user,
      );
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Your reaction has been added successfully.',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  //Get Reaction Count
  @Get(':postId')
  async getReactionCounts(@Param('postId') postId: string) {
    try {
      const result = await this.reactionService.getReactionCounts(postId);
      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Fetch all reaction counts successfully.',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }
}
