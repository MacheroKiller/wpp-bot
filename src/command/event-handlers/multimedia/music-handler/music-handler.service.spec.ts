import { Test, TestingModule } from '@nestjs/testing';
import { MusicHandlerService } from './music-handler.service';

describe('MusicHandlerService', () => {
  let service: MusicHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicHandlerService],
    }).compile();

    service = module.get<MusicHandlerService>(MusicHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
