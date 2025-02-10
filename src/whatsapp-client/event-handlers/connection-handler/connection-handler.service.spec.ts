import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionHandlerService } from './connection-handler.service';

describe('ConnectionHandlerService', () => {
  let service: ConnectionHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionHandlerService],
    }).compile();

    service = module.get<ConnectionHandlerService>(ConnectionHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
