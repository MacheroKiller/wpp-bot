import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountHandlerService } from './create-account.handler.service';

describe('CreateAccountHandlerService', () => {
  let service: CreateAccountHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAccountHandlerService],
    }).compile();

    service = module.get<CreateAccountHandlerService>(CreateAccountHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
