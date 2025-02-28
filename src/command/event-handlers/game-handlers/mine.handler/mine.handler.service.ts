import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import {
  dragonMessage,
  mineSuccessMessage,
} from '../../utils/message-sender.utils';
import { MessageSenderService } from '../message.sender/message.sender.service';

@Injectable()
export class MineHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.MINE)
  private async handleMine(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;

    const { user } =
      await this._accountHandler.genericVerifyUserColdownAndTarget(
        payload,
        true,
        false,
      );

    // No user found
    if (!user) return;

    const userTool = await this._groupService.getStoreItemById(user.tool);

    const minedAmount = Math.floor(
      this.getMinedTotalAmount(userTool?.multiplier as number)!,
    );
    const newBalance = user.balance + minedAmount;
    user.balance = newBalance < 0 ? 0 : newBalance;
    const finalMessage =
      minedAmount < 0
        ? dragonMessage(minedAmount)
        : mineSuccessMessage(minedAmount);

    await this._groupService.newBalanceMember(user);
    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      finalMessage,
    );
  }

  private getMinedTotalAmount(toolMultiplier: number) {
    const multiplier =
      (Math.random() <= 0.75 ? toolMultiplier : -toolMultiplier) * 100;
    console.log(multiplier);
    const amount = Math.floor(Math.random() * 100);
    console.log(amount);

    if (amount < 90) return amount * multiplier * 1.5;
    if (amount <= 100) return amount * multiplier * 2;
  }
}
