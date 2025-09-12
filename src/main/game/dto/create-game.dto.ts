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

  @ApiProperty({ example: 'Praise', description: 'English meaning of the word' })
  @IsString()
  englishText: string;

  @ApiProperty({ example: 'https://example.com/audio/1-1.mp3', description: 'Optional audio link for the word/ayah' })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  // ✅ English side
  @ApiProperty({ example: 'Praise', description: 'Correct English meaning' })
  @IsString()
  correct: string;

  @ApiProperty({
    example: ['Praise', 'Book', 'Mercy', 'Day'],
    description: 'Multiple choice English options (including the correct one)',
    isArray: true,
  })
  @IsArray()
  optionsEnglish: string[];

  // ✅ Arabic side
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
}
