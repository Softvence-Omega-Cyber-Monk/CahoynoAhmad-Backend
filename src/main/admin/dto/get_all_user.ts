import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class getUserDTO {
    @ApiProperty({
        description:"search user by name",
        example:"milon",
        required:false
    })
    @IsString()
    @IsOptional()
   readonly search:string

    @ApiProperty({
        description:"page number",
        required:false,
        type:Number,
        default:1
    })
    @IsOptional()
    @Type(()=>Number)
    @Min(1)
    @IsNumber()
   page?:number=1

    @ApiProperty({
        description:"user per page",
        required:false,
        type:Number,
        default:10
    })
    @IsOptional()
    @Type(()=>Number)
    @Min(1)
    @IsNumber()
   limit:number=10
}