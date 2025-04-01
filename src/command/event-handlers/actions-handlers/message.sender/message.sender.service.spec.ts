import { Test, TestingModule } from '@nestjs/testing';
import { MessageSenderService } from './message.sender.service';

describe('MessageSenderService', () => {
  let service: MessageSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageSenderService],
    }).compile();

    service = module.get<MessageSenderService>(MessageSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
