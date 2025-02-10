import { Test, TestingModule } from '@nestjs/testing';
import { KissHandlerService } from './kiss.handler.service';

describe('KissHandlerService', () => {
  let service: KissHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KissHandlerService],
    }).compile();

    service = module.get<KissHandlerService>(KissHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
