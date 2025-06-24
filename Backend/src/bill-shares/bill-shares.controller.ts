import { Controller } from '@nestjs/common';
import { BillSharesService } from './bill-shares.service';

@Controller('bill-shares')
export class BillSharesController {
  constructor(private readonly billSharesService: BillSharesService) {}
}
