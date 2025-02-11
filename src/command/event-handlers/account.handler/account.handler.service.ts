import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupMember } from 'src/group/models/group-member.model';
import { GroupService } from 'src/group/services/group.service';
import { jidToNumber } from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';

@Injectable()
export class AccountHandlerService {
  constructor(private readonly _groupService: GroupService) {}

  @OnEvent(Commands.CREATE_ACCOUNT)
  private async handleCreateAccount(payload: CommandPayload) {
    const { groupJid, senderJid, WaMessage, client } = payload;

    const response = await this._groupService.getGroupMemberByJid(senderJid);

    if (response) {
      await client._wppSocket.sendMessage(
        groupJid,
        {
          text: `You already have an account.`,
        },
        { quoted: WaMessage },
      );
      return;
    }

    const groupMember = {
      jid: jidToNumber(senderJid),
      name: WaMessage.pushName,
      balance: 500,
    } as GroupMember;
    await this._groupService.createGroupMember(groupMember);
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `New account created with *$500MP*`,
      },
      { quoted: WaMessage },
    );
  }

  @OnEvent(Commands.NO_ACCOUNT)
  async handleNoAccount(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `First create an account with the command *!${Commands.CREATE_ACCOUNT}*`,
      },
      { quoted: WaMessage },
    );
  }

  @OnEvent(Commands.NO_USER_FOUND)
  async handleNoUserFound(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `No user found.`,
      },
      { quoted: WaMessage },
    );
  }

  async handleCommandTime(payload: CommandPayload): Promise<boolean> {
    const { groupJid, senderJid, WaMessage, client } = payload;

    const user = await this._groupService.getGroupMemberByJid(senderJid);
    if (!user) {
      await this.handleNoAccount(payload);
      return false;
    }

    const date = new Date().getTime();
    const time = date - user.updatedAt.getTime();
    const minutes = Math.floor(time / 60000);

    if (minutes < 1) {
      await client._wppSocket.sendMessage(
        groupJid,
        {
          text: `You can only use this command every minute.`,
        },
        { quoted: WaMessage },
      );
      return false;
    }
    return true;
  }
}
