import { Test, TestingModule } from '@nestjs/testing';
import { BillSharesController } from './bill-shares.controller';
import { BillSharesService } from './bill-shares.service';

describe('BillSharesController', () => {
  let controller: BillSharesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillSharesController],
      providers: [BillSharesService],
    }).compile();

    controller = module.get<BillSharesController>(BillSharesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
