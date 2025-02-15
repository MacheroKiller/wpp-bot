import { Test, TestingModule } from '@nestjs/testing';
import { AttackHandlerService } from './attack.handler.service';

describe('AttackHandlerService', () => {
  let service: AttackHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttackHandlerService],
    }).compile();

    service = module.get<AttackHandlerService>(AttackHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
