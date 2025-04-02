import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { attackSuccessMessage } from '../../utils/message-sender.utils';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import { GroupMember } from 'src/group/models/group-member.model';

@Injectable()
export class AttackHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.ATTACK)
  private async handleAttack(
    payload: CommandPayload,
    user: GroupMember,
    target: GroupMember,
  ) {}
}
