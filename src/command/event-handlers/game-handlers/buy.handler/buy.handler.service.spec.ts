import { Test, TestingModule } from '@nestjs/testing';
import { BuyHandlerService } from './buy.handler.service';

describe('BuyHandlerService', () => {
  let service: BuyHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyHandlerService],
    }).compile();

    service = module.get<BuyHandlerService>(BuyHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
