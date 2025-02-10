import { Test, TestingModule } from '@nestjs/testing';
import { CoinFlipHandlerService } from './coin-flip.handler.service';

describe('CoinFlipHandlerService', () => {
  let service: CoinFlipHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinFlipHandlerService],
    }).compile();

    service = module.get<CoinFlipHandlerService>(CoinFlipHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
