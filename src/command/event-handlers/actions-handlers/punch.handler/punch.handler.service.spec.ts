import { Test, TestingModule } from '@nestjs/testing';
import { PunchHandlerService } from './punch.handler.service';

describe('PunchHandlerService', () => {
  let service: PunchHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PunchHandlerService],
    }).compile();

    service = module.get<PunchHandlerService>(PunchHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
