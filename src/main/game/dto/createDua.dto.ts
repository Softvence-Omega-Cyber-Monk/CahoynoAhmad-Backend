import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class DuaDto {
    @ApiProperty({ example: 'Niyyah Subuh', description: 'Display name of the dua' })
    @IsOptional()
    @IsString()
    duaDisplayName:string

    @ApiProperty({ example: 'niyyah_subuh', description: 'Name of the dua for reletions' })
    @IsOptional()
    @IsString()
    duaReletionName:string
}