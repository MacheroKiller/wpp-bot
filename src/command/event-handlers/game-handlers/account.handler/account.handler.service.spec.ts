import { Test, TestingModule } from '@nestjs/testing';
import { AccountHandlerService } from './account.handler.service';

describe('AccountHandlerService', () => {
  let service: AccountHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountHandlerService],
    }).compile();

    service = module.get<AccountHandlerService>(AccountHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
