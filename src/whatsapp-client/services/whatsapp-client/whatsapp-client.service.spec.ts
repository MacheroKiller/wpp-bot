import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappClientService } from './whatsapp-client.service';

describe('WhatsappClientService', () => {
  let service: WhatsappClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsappClientService],
    }).compile();

    service = module.get<WhatsappClientService>(WhatsappClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
