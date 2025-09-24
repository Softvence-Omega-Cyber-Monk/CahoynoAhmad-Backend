import { Controller } from '@nestjs/common';
import { QuestService } from './questService';


@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}
}
