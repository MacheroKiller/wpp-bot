import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';

@Injectable()
export class MineHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
  ) {}

  @OnEvent(Commands.MINE)
  private async handleMine(payload: CommandPayload) {
    const { groupJid, senderJid, WaMessage, client } = payload;

    if (!(await this._accountHandler.handleCommandTime(payload))) {
      return;
    }

    const user = await this._groupService.getGroupMemberByJid(senderJid);

    if (!user) {
      await this._accountHandler.handleNoAccount(payload);
      return;
    }

    const minedAmount = Math.floor(Math.random() * 100) + 1;
    const newBalance = user.balance + minedAmount;
    await this._groupService.newBalanceMember(user, newBalance);
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `You mined *$${minedAmount}MP*`,
      },
      { quoted: WaMessage },
    );
  }
}
