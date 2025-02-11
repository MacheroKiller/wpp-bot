import { Test, TestingModule } from '@nestjs/testing';
import { InfoHandlerService } from './info.handler.service';

describe('InfoHandlerService', () => {
  let service: InfoHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfoHandlerService],
    }).compile();

    service = module.get<InfoHandlerService>(InfoHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
