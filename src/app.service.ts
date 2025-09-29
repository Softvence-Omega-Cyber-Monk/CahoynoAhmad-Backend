import { Injectable } from '@nestjs/common';
import { htmlContent } from './utils/htmlContent';

@Injectable()
export class AppService {
  getHello(): string {
    return htmlContent;
  }
}
