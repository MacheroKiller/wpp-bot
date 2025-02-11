import { Test, TestingModule } from '@nestjs/testing';
import { BalanceHandlerService } from './balance.handler.service';

describe('BalanceHandlerService', () => {
  let service: BalanceHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceHandlerService],
    }).compile();

    service = module.get<BalanceHandlerService>(BalanceHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
