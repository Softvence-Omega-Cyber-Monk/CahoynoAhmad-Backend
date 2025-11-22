import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateGameDto {
  // Surah & Ayah identifiers
  @ApiProperty({ example: 114, description: 'Surah number' })
  @IsOptional()
  @IsNumber()
  surahId?: number;

  @ApiProperty({ example: 1, description: 'Ayah number' })
  @IsOptional()
  @IsNumber()
  ayahId?: number;

  // Main text
  @ApiProperty({ example: 'النَّاسِ', description: 'Arabic word or text' })
  @IsOptional()
  @IsString()
  arabicText?: string;

  @ApiProperty({ example: 'Manusia', description: 'Indonesian meaning' })
  @IsOptional()
  @IsString()
  indonesianText?: string;

  @ApiProperty({
    example: 'https://example.com/audio/114-1.mp3',
    description: 'Optional audio URL'
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  // Correct Indonesian + options
  @ApiProperty({ example: 'Manusia', description: 'Correct Indonesian answer' })
  @IsOptional()
  @IsString()
  correctIndonesian?: string;

  @ApiProperty({
    example: ['Manusia', 'Tuhan', 'Raja', 'Kejahatan'],
    description: 'Indonesian multiple choice options',
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionsIndonesian?: string[];

  // Correct Arabic + options
  @ApiProperty({ example: 'النَّاسِ', description: 'Correct Arabic answer' })
  @IsOptional()
  @IsString()
  correctArabic?: string;

  @ApiProperty({
    example: ['النَّاسِ', 'رَبِّ', 'مَلِكِ', 'شَرِّ'],
    description: 'Arabic multiple choice options',
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionsArabic?: string[];

  // Data type fields (dua/surah)
  @ApiProperty({ example: 'dua', description: 'Type of content' })
  @IsOptional()
  @IsString()
  dataType?: string;

  @ApiProperty({ example: 'subbah', description: 'Dua name if applicable' })
  @IsOptional()
  @IsString()
  duaName?: string;

  // English side
  @ApiProperty({ example: 'Mankind', description: 'Correct English meaning' })
  @IsOptional()
  @IsString()
  correctEnglish?: string;

  @ApiProperty({
    example: ['Mankind', 'Lord', 'King', 'Evil'],
    description: 'English multiple choice options',
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionsEnglish?: string[];
}
