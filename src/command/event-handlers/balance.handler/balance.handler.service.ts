import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupMember } from 'src/group/models/group-member.model';
import { GroupService } from 'src/group/services/group.service';
import { jidToNumber } from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';

@Injectable()
export class BalanceHandlerService {
  constructor(private readonly _groupService: GroupService) {}

  @OnEvent(Commands.BALANCE)
  @OnEvent(Commands.MONEY)
  async handleBalance(payload: CommandPayload) {
    const { groupJid, senderJid, WaMessage, client } = payload;

    // Creating a new group member o finding the existing one
    const groupMember = {
      jid: jidToNumber(senderJid),
      name: WaMessage.pushName,
      balance: 500,
    } as GroupMember;

    const response = await this._groupService.getGroupMemberByJid(
      groupMember.jid,
    );

    if (response.balance === undefined) {
      await this._groupService.createGroupMember(groupMember);
      response.balance = 500;
    }

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `Your balance is *$${response.balance}MP*`,
      },
      { quoted: WaMessage },
    );
  }
}
