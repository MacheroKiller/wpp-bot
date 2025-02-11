import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { getFormatedNumber } from '../../utils/event-handlers.utils';
import { WAMessage } from 'baileys';

@Injectable()
export class InfoHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
  ) {}

  @OnEvent(Commands.PROFILE)
  private async handleProfile(payload: CommandPayload) {
    const { senderJid, WaMessage, client } = payload;

    const user = await this._groupService.getGroupMemberByJid(senderJid);

    if (!user) {
      await this._accountHandler.handleNoAccount(payload);
      return;
    }
    const userTool = await this._groupService.getStoreItemById(user.tool);

    await client._wppSocket.sendMessage(
      senderJid,
      {
        text: `*Butter God 🧈:* Human! Your stats are:
- *Name:* ${user.name}
- *Balance:* ${getFormatedNumber(user.balance)}
- *Tool:* ${userTool?.name}`,
      },
      { quoted: WaMessage },
    );
  }

  @OnEvent(Commands.INFO)
  private async handleInfo(payload: CommandPayload) {
    const { groupJid, senderJid, args, WaMessage, client } = payload;

    const user = (await this._groupService.getGroupMemberByJid(senderJid))!;

    if (!user) {
      await this._accountHandler.handleNoAccount(payload);
      return;
    }

    if (!args.length) {
      await this.errorItemNoFoundMessage(client, groupJid, WaMessage);
      return;
    }

    const userTool = await this._groupService.getStoreItemById(
      args[0].toUpperCase(),
    );

    if (!userTool) {
      await this.errorItemNoFoundMessage(client, groupJid, WaMessage);
      return;
    }

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*Butter God 🧈:* Human! The stats are:
- *Name:* ${userTool.name}
- *Price:* ${getFormatedNumber(userTool.price)}
- *Multiplier:* ${userTool.multiplier}
- *Description:* ${userTool.description}`,
      },
      { quoted: WaMessage },
    );
  }

  private async errorItemNoFoundMessage(
    client,
    groupJid,
    WaMessage: WAMessage,
  ) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*Butter God 🧈:* Stupid human! What item is that? `,
      },
      { quoted: WaMessage },
    );
  }
}
