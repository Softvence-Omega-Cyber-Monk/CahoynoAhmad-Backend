import { IsOptional, IsString } from 'class-validator';

export class CreateAiDto {
  @IsString()
  text: string;
  @IsString()
  tone: string;
  @IsString()
  @IsOptional()
  session_id: string;
  @IsOptional()
  @IsString()
  user_plan: string;
}

export class history {
  @IsString()
  session_id: string;
}
