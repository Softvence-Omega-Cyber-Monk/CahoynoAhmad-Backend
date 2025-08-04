import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {

    
      @IsNumber()
      @IsOptional()
      dailyGenerations: number;
    
      @IsNumber()
      toneStylesAllowed: number;
    
      @IsBoolean()
      @IsOptional()
      publicFeedAccess: boolean;
    
      @IsBoolean()
      @IsOptional()
      communitySharing: boolean;
    
      @IsBoolean()
      @IsOptional()
      postInteraction: boolean;
}
