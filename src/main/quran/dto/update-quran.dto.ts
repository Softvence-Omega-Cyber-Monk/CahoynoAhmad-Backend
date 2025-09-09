import { PartialType } from '@nestjs/swagger';
import { CreateQuranDto } from './create-quran.dto';

export class UpdateQuranDto extends PartialType(CreateQuranDto) {}
