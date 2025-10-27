import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber } from "class-validator"

export class GetAllPaymentDto {
    @ApiProperty({
        example:1,
        description:"page number",
        required:true,
        type:Number
    })
    @IsNumber()
    @Type(()=>Number)
    page:number

    @ApiProperty({
        example:10,
        description:"limit",
        required:true,
        type:Number
    })
    @IsNumber()
    @Type(()=>Number)
    limit:number
}