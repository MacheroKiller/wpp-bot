import { Test, TestingModule } from '@nestjs/testing';
import { KillHandlerService } from './kill.handler.service';

describe('KillHandlerService', () => {
  let service: KillHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KillHandlerService],
    }).compile();

    service = module.get<KillHandlerService>(KillHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
