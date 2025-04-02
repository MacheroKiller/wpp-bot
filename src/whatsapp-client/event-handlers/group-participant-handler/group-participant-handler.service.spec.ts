import { Test, TestingModule } from '@nestjs/testing';
import { GroupParticipantHandlerService } from './group-participant-handler.service';

describe('GroupParticipantHandlerService', () => {
  let service: GroupParticipantHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupParticipantHandlerService],
    }).compile();

    service = module.get<GroupParticipantHandlerService>(GroupParticipantHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
