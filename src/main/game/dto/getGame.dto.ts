import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class GetGameDto {
    @ApiProperty({
        description: 'Page number for pagination',
        example: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;
}
