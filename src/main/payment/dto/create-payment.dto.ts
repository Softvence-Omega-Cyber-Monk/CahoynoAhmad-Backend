import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreatePaymentDto {
    @ApiProperty({
        example:"price_1SQgZIER98NUaoU4hb9Trupz"
    })
    @IsString()
    priceId:string

    @ApiProperty({
        example:"1"
    })
    @IsString()
    planId:string

    @ApiProperty({
        example:"Pro"
    })
    @IsString()
    planName:string
}
