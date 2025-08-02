import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StripPaymentService } from './strip-payment.service';
import { CreateStripPaymentDto } from './dto/create-strip-payment.dto';
import { UpdateStripPaymentDto } from './dto/update-strip-payment.dto';

@Controller('strip-payment')
export class StripPaymentController {
  constructor(private readonly stripPaymentService: StripPaymentService) {}

  @Post()
  create(@Body() createStripPaymentDto: CreateStripPaymentDto) {
    return this.stripPaymentService.create(createStripPaymentDto);
  }

  @Get()
  findAll() {
    return this.stripPaymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripPaymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripPaymentDto: UpdateStripPaymentDto) {
    return this.stripPaymentService.update(+id, updateStripPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripPaymentService.remove(+id);
  }
}
