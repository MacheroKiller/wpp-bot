import { Test, TestingModule } from '@nestjs/testing';
import { CommandConfigService } from './command-config.service';

describe('CommandConfigService', () => {
  let service: CommandConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandConfigService],
    }).compile();

    service = module.get<CommandConfigService>(CommandConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
