import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands, Cooldown } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import {
  dragonMessage,
  mineSuccessMessage,
} from '../../utils/message-sender.utils';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import { GroupMember } from 'src/group/models/group-member.model';

@Injectable()
export class MineHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.MINE)
  private async handleMine(payload: CommandPayload, user: GroupMember) {
    const { groupJid, WaMessage, client } = payload;

    const mineCooldown = Commands.MINE + Cooldown;

    const userTool = await this._groupService.getStoreItemById(user.tool);

    const minedAmount = Math.floor(
      this.getMinedTotalAmount(userTool?.multiplier as number)!,
    );
    const newBalance =
      user.balance + minedAmount >= 0 ? minedAmount : user.balance * -1;

    await this._groupService.updateBalance(
      user,
      { [mineCooldown]: new Date() },
      newBalance,
    );
    const finalMessage =
      newBalance < 0
        ? dragonMessage(newBalance)
        : mineSuccessMessage(newBalance);

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      finalMessage,
    );
  }

  private getMinedTotalAmount(toolMultiplier: number) {
    const multiplier = Math.random() <= 0.95 ? toolMultiplier : -toolMultiplier;
    console.log(multiplier);
    const amount = Math.floor((Math.random() + 1) * 1000);
    console.log(amount);

    if (amount < 1900) return amount * multiplier * 1.5;
    if (amount <= 2000) return amount * multiplier * 2;
  }
}
