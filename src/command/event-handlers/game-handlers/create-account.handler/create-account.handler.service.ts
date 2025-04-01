import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupMember } from 'src/group/models/group-member.model';
import { jidToNumber } from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import {
  accountAlreadyExists,
  newAccountCreated,
} from '../../utils/message-sender.utils';
import { GroupService } from 'src/group/services/group.service';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';

@Injectable()
export class CreateAccountHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.CREATE_ACCOUNT)
  private async handleCreateAccount(payload: CommandPayload) {
    const { groupJid, senderJid, WaMessage, client } = payload;

    const response = await this._groupService.getGroupMemberByJidAndGroup(
      senderJid,
      groupJid,
    );

    if (response) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        accountAlreadyExists,
      );
      return;
    }

    const groupMember = {
      jid: jidToNumber(senderJid),
      name: WaMessage.pushName,
      groupJid,
    } as GroupMember;
    await this._groupService.createGroupMember(groupMember);

    // Sendind message
    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      newAccountCreated(500),
    );
  }
}
