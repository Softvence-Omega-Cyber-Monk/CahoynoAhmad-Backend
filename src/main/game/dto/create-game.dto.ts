// src/game/dto/create-game.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 1, description: 'Surah number (e.g., 1 = Al-Fatiha)' })
  @IsOptional()
  surahId?: number;

  @ApiProperty({ example: 1, description: 'Ayah number within the surah' })
  @IsOptional()
  ayahId?: number;

  @ApiProperty({ example: 'الْحَمْدُ', description: 'Arabic word' })
  @IsString()
  arabicText: string;

  @ApiProperty({ example: 'Praise', description: 'Indonesian meaning of the Arabic word' })
  @IsString()
  indonesianText: string;

  @ApiProperty({
    example: 'https://example.com/audio/1-1.mp3',
    description: 'Optional audio link for the word/ayah',
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  //  Indonesian side
  @ApiProperty({ example: 'Praise', description: 'Correct Indonesian meaning' })
  @IsString()
  correct: string;

  @ApiProperty({
    example: ['Praise', 'Book', 'Mercy', 'Day'],
    description: 'Multiple choice Indonesian options (including the correct one)',
    isArray: true,
  })
  @IsArray()
  optionsIndonesian: string[];

  //  Arabic side
  @ApiProperty({ example: 'الْحَمْدُ', description: 'Correct Arabic word' })
  @IsString()
  correctArabic: string;

  @ApiProperty({
    example: ['الْحَمْدُ', 'كِتَاب', 'رَحْمَة', 'يَوْم'],
    description: 'Multiple choice Arabic options (including the correct one)',
    isArray: true,
  })
  @IsArray()
  optionsArabic: string[];

  @ApiProperty({
    example: 'dua or surah',
  })
  @IsOptional()
  @IsString()
  dataType?:string

    @ApiProperty({
    example: 'subbah',
  })
  @IsOptional()
  @IsString()
  duaName?:string
  //  English side
  @ApiProperty({ example: 'Praise', description: 'Correct English translation' })
  @IsString()
  correctEnglish: string;

  @ApiProperty({
    example: ['Praise', 'Book', 'Mercy', 'Day'],
    description: 'Multiple choice English options (including the correct one)',
    isArray: true,
  })
  @IsArray()
  optionsEnglish: string[];
}
