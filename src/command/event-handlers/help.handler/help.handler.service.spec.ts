import { Test, TestingModule } from '@nestjs/testing';
import { HelpHandlerService } from './help.handler.service';

describe('HelpHandlerService', () => {
  let service: HelpHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpHandlerService],
    }).compile();

    service = module.get<HelpHandlerService>(HelpHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
