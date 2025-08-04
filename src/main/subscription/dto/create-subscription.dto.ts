import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { PlanType } from 'generated/prisma';


export class CreateSubscriptionDto {

  @IsEnum(PlanType)
  planType: PlanType;

  @IsNumber()
  dailyGenerations: number;

  @IsNumber()
  toneStylesAllowed: number;

  @IsBoolean()
  publicFeedAccess: boolean;

  @IsBoolean()
  communitySharing: boolean;

  @IsBoolean()
  postInteraction: boolean;
}
