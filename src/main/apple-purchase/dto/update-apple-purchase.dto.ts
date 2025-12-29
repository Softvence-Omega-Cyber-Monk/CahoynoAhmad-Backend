import { PartialType } from '@nestjs/swagger';
import { CreateApplePurchaseDto } from './create-apple-purchase.dto';

export class UpdateApplePurchaseDto extends PartialType(CreateApplePurchaseDto) {}
