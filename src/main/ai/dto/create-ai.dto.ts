import { IsString } from 'class-validator';

export class CreateAiDto {
  @IsString()
  promt: string;
  @IsString()
  mode: string;
  @IsString()
  session_id: string;
  @IsString()
  user_plan:string
}

export class history{
  @IsString()
  session_id:string
}

