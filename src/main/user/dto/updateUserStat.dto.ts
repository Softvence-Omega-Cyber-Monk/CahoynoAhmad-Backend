import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for updating user statistics.
 * This DTO is designed for partial updates, so all fields are optional.
 */
export class UpdateUserStatDto {
  @ApiProperty({
    example: true,
    description: 'A flag to trigger the backend day streak calculation.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  triggerStreakUpdate?: boolean;

  @ApiProperty({
    example: 10,
    description: 'The amount of experience points earned in the current action.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  xpEarned?: number;

  @ApiProperty({
    example: 3,
    description: 'The number of badges earned by the user.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  badges?: number;

  @ApiProperty({
    example: 5,
    description: 'The current level of the user.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiProperty({
    example: 45,
    description: 'The number of minutes practiced in the current action.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minutesPracticed?: number;

  @ApiProperty({
    example: 10,
    description: 'The number of quests completed in the current action.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  questsCompleted?: number;

  @ApiProperty({
    example: 120,
    description: 'The number of Ayahs read in the current action.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ayahsRead?: number;
}
