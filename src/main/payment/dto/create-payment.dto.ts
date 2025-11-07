import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreatePaymentDto {
    @ApiProperty({
        example:"price_id084854rerer"
    })
    @IsString()
    priceId:string

    @ApiProperty({
        example:"plan_id084854rerer"
    })
    @IsString()
    planId:string

    @ApiProperty({
        example:"plan_name"
    })
    @IsString()
    planName:string
}
