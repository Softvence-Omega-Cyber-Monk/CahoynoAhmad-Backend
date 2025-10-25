import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/utils/authorization/role.enum';

export class UpdateAdminDto  {

    @ApiProperty({
        description:"role of user",
        example:"admin",
        required:true
    })
    @IsString()
    @IsOptional()
    readonly role:Role.Admin;
}
