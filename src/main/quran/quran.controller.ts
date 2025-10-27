import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Post,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { QuranService } from './quran.service';
import { ApiOperation, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as fs from 'fs';

@Controller('quran')
export class QuranController {
  constructor(private readonly quranService: QuranService) {}

  // Seed one time whole quran
  @Post('seed')
  async seed() {
    try {
      await this.quranService.seedQuran();
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
  
@Post('upload')
@ApiOperation({ summary: 'Upload Quran ZIP file for frontend download' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'The Quran ZIP file',
      },
    },
  },
})
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/quran',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `quran-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(zip)$/)) {
        return cb(new BadRequestException('Only .zip files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
)
async uploadQuranZip(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('File not found or invalid format.');
  }
  return {
    statusCode: HttpStatus.OK,
    message: 'Quran ZIP uploaded successfully',
    filePath: `/uploads/quran/${file.filename}`,
  };
}


  //  Get all Quran by page and limit
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    try {
      const res = await this.quranService.findAll(+page, +limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Quran Retrieve successful',
        data: res,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  //  Get one verse by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const verse = await this.quranService.findOne(+id);
      if (!verse) {
        throw new NotFoundException(`Verse with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Verse Retrieve successful',
        data: verse,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  //  Get one verse by Surah & Verse number
  @Get('surah/:surahId/verse/:verseNumber')
  async findBySurahAndVerse(
    @Param('surahId') surahId: string,
    @Param('verseNumber') verseNumber: string,
  ) {
    try {
      const verse = await this.quranService.findBySurahAndVerse(+surahId, +verseNumber);
      if (!verse) {
        throw new NotFoundException(
          `Verse not found for Surah ${surahId}, Verse ${verseNumber}`,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Verse Retrieve successful',
        data: verse,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  //  Search verse by keyword
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

  //  Get Surah by name
  @Get('surah/:name')
  @ApiOperation({ summary: 'Get a Surah by its name' })
  @ApiParam({
    name: 'name',
    description: 'The name of the Surah (e.g., Al-Fatihah, Al-Baqarah)',
    example: 'Al-Fatihah',
    type: String,
  })
  async getSurahByName(@Param('name') name: string) {
    try {
      const surah = await this.quranService.getSurahByName(name);
      return {
        statusCode: HttpStatus.OK,
        message: 'Surah Retrieve successful',
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
