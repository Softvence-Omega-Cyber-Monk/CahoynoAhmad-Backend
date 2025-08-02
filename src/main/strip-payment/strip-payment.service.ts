import { Injectable } from '@nestjs/common';
import { CreateStripPaymentDto } from './dto/create-strip-payment.dto';
import { UpdateStripPaymentDto } from './dto/update-strip-payment.dto';

@Injectable()
export class StripPaymentService {
  create(createStripPaymentDto: CreateStripPaymentDto) {
    return 'This action adds a new stripPayment';
  }

  findAll() {
    return `This action returns all stripPayment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripPayment`;
  }

  update(id: number, updateStripPaymentDto: UpdateStripPaymentDto) {
    return `This action updates a #${id} stripPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripPayment`;
  }
}
