import { Test, TestingModule } from '@nestjs/testing';
import { MineHandlerService } from './mine.handler.service';

describe('MineHandlerService', () => {
  let service: MineHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MineHandlerService],
    }).compile();

    service = module.get<MineHandlerService>(MineHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
