import { Test, TestingModule } from '@nestjs/testing';
import { RouletteHandlerService } from './roulette.handler.service';

describe('RouletteHandlerService', () => {
  let service: RouletteHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouletteHandlerService],
    }).compile();

    service = module.get<RouletteHandlerService>(RouletteHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
