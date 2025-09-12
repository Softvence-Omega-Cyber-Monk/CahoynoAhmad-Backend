import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { QuranService } from './quran.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('quran')
export class QuranController {
  constructor(private readonly quranService: QuranService) {}
  // post one time whole quran
  @Post('seed')
  async seed() {
    try {
      const res = await this.quranService.seedQuran();
      return {
        status: HttpStatus.OK,
        message: 'Quran seeded successfully',
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  // get all quran by page and limit
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    try {
      const res = await this.quranService.findAll(+page, +limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Quran Retrive successful',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  // get one verse by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const verse = await this.quranService.findOne(+id);
      if (!verse) {
        throw new NotFoundException(`Verse with ID ${id} not found`);
      }
      return {
        statuscode: HttpStatus.OK,
        message: 'Verse Retrive successful',
        data: verse,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  // get one verse by surah and verse number
  @Get('surah/:surahId/verse/:verseNumber')
  async findBySurahAndVerse(
    @Param('surahId') surahId: string,
    @Param('verseNumber') verseNumber: string,
  ) {
    try {
      const verse = await this.quranService.findBySurahAndVerse(
        +surahId,
        +verseNumber,
      );
      if (!verse) {
        throw new NotFoundException(
          `Verse not found for Surah ${surahId}, Verse ${verseNumber}`,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Verse Retrive successful',
        data: verse,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  // search verse by keyword
  @Get('search/:keyword')
  async search(@Param('keyword') keyword: string) {
    try {
      const res = await this.quranService.search(keyword);
      return {
        statusCode: HttpStatus.OK,
        message: 'Search successful',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  // get surah by name
  @Get('surah/:name')
  @ApiOperation({ summary: 'Get a surah by its name' })
  @ApiParam({
    name: 'name',
    description: 'The name of the surah (e.g., Al-Fatiha, Al-Baqarah)',
    example: 'Al-Fatihah',
    type: String,
  })
  async getSurahByName(@Param('name') name: string) {
    try {
      const surah = await this.quranService.getSurahByName(name);
      return {
        statusCode: HttpStatus.OK,
        message: 'Surah Retrive successful',
        data: surah,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }
}
