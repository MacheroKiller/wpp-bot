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

    const user = (await this._groupService.getGroupMemberByJid(
      senderJid,
      groupJid,
    ))!;

    const userTool = await this._groupService.getStoreItemById(user.tool);

    const minedAmount = this.getMinedTotalAmount(
      userTool?.multiplier as number,
    );
    const newBalance = user.balance + minedAmount!;
    const verifyBalance = newBalance < 0 ? 0 : newBalance;
    const finalMessage =
      minedAmount! < 0
        ? 'Oh no! 🔥A dragon has burned your precious rocks to ashes🔥!'
        : 'No dragons here! You found some precious rocks!🌋';

    await this._groupService.newBalanceMember(user, verifyBalance);
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `${finalMessage} *$${minedAmount}MP*`,
      },
      { quoted: WaMessage },
    );
  }

  private getMinedTotalAmount(toolMultiplier: number) {
    const amount = Math.floor(Math.random() * 100) + 1;
    const multiplier = Math.random() <= 0.65 ? toolMultiplier : -toolMultiplier;
    if (amount < 80) return amount * 2 * multiplier;
    if (amount < 94) return amount * 3 * multiplier;
    if (amount <= 100) return amount * 4 * multiplier;
  }
}
