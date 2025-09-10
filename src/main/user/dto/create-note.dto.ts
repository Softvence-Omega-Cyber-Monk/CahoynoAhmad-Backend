import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateNoteDTO{
    @ApiProperty({example:"This is my first note"})
    @IsString()
    @IsNotEmpty()
    title:string

    @ApiProperty({example:"This is the description of my first note"})
    @IsString()
    @IsNotEmpty()
    description:string
}