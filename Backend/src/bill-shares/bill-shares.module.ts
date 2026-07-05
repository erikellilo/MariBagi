import { Module } from '@nestjs/common';
import { BillSharesService } from './bill-shares.service';
import { BillSharesController } from './bill-shares.controller';

@Module({
  controllers: [BillSharesController],
  providers: [BillSharesService],
})
export class BillSharesModule {}
