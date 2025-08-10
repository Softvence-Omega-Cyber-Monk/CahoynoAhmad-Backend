// import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
// import { PlanType } from 'generated/prisma';

// export class CreateSubscriptionDto {
//   @IsEnum(PlanType)
//   planType: PlanType;

//   @IsNumber()
//   dailyGenerations: number;

//   @IsNumber()
//   toneStylesAllowed: number;

//   @IsBoolean()
//   publicFeedAccess: boolean;

//   @IsBoolean()
//   communitySharing: boolean;

//   @IsBoolean()
//   postInteraction: boolean;
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { PlanType } from 'generated/prisma';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Type of the subscription plan',
    enum: PlanType, // This will make Swagger show a dropdown
    example: PlanType.FREE,
  })
  @IsEnum(PlanType)
  planType: PlanType;

  @ApiProperty({
    description: 'Number of generations allowed per day',
    example: 10,
  })
  @IsNumber()
  dailyGenerations: number;

  @ApiProperty({
    description: 'Number of tone styles allowed',
    example: 5,
  })
  @IsNumber()
  toneStylesAllowed: number;

  @ApiProperty({
    description: 'Whether the user has access to the public feed',
    example: true,
  })
  @IsBoolean()
  publicFeedAccess: boolean;

  @ApiProperty({
    description: 'Whether community sharing is enabled',
    example: false,
  })
  @IsBoolean()
  communitySharing: boolean;

  @ApiProperty({
    description: 'Whether post interactions are enabled',
    example: true,
  })
  @IsBoolean()
  postInteraction: boolean;
}
