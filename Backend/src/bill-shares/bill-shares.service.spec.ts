import { Test, TestingModule } from '@nestjs/testing';
import { BillSharesService } from './bill-shares.service';

describe('BillSharesService', () => {
  let service: BillSharesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillSharesService],
    }).compile();

    service = module.get<BillSharesService>(BillSharesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
