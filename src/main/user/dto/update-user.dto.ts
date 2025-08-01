import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  userName: string;
  @IsString()
  coverPhoto: string;
  @IsString()
  profilePhoto: string;
  @IsString()
  bio: string;
  @IsString()
  website: string;
  @IsString()
  location: string;

  verified: boolean;
  @IsString()
  facebook: string;

  @IsString()
  twitter: string;

  @IsString()
  instagram: string;

  @IsString()
  linkedin: string;

  @IsString()
  xUrl: string;
}
