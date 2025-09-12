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

  @ApiProperty({ example: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', description: 'Arabic text of ayah or word' })
  @IsString()
  arabicText: string;

  @ApiProperty({ example: 'All praise is due to Allah, Lord of the worlds', description: 'English translation or meaning' })
  @IsString()
  englishText: string;

  @ApiProperty({ example: 'https://example.com/audio/1-1.mp3', description: 'Optional audio link for ayah' })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiProperty({ example: 'Praise be to Allah', description: 'Correct answer' })
  @IsString()
  correct: string;

  @ApiProperty({
    example: ['Praise be to Allah', 'The Book', 'Mercy', 'Day of Judgment'],
    description: 'Multiple choice options (including the correct one)',
    isArray: true,
  })
  @IsArray()
  options: string[];
}
