import { Test, TestingModule } from '@nestjs/testing';
import { StoreHandlerService } from './store.handler.service';

describe('StoreHandlerService', () => {
  let service: StoreHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreHandlerService],
    }).compile();

    service = module.get<StoreHandlerService>(StoreHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
