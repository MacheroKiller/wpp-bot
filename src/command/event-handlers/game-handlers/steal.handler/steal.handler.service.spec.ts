import { Test, TestingModule } from '@nestjs/testing';
import { StealHandlerService } from './steal.handler.service';

describe('StealHandlerService', () => {
  let service: StealHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StealHandlerService],
    }).compile();

    service = module.get<StealHandlerService>(StealHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
