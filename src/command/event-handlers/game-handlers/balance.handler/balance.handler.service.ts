import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { getMentionedJids } from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import {
  getFormatedNumber,
  getNumberFromString,
} from '../../utils/event-handlers.utils';
import { UserPosition } from './interfaces/balance-top.handler.interface';
import { MessageSenderService } from '../message.sender/message.sender.service';
import {
  errorAmountMessage,
  errorInsufficientFunds,
  passMoneySuccessMessage,
  userBalance,
} from '../../utils/message-sender.utils';

@Injectable()
export class BalanceHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.BALANCE)
  @OnEvent(Commands.MONEY)
  private async handleBalance(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;

    const needTarget = !!getMentionedJids(WaMessage).length;

    const { user, target } =
      await this._accountHandler.genericVerifyUserColdownAndTarget(
        payload,
        false,
        needTarget,
      );

    const response = needTarget ? target : user;
    // No user found
    if (!response) return;

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      userBalance(response),
    );
  }

  @OnEvent(Commands.PASS_MONEY)
  private async handlePassMoney(payload: CommandPayload) {
    const { groupJid, args, WaMessage, client } = payload;

    const { user, target } =
      await this._accountHandler.genericVerifyUserColdownAndTarget(
        payload,
        false,
        true,
      );

    const { amount, isNumber } = getNumberFromString(args[1]);

    // No user or target found
    if (!user || !target) return;

    if (!isNumber) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorAmountMessage,
      );
      return;
    }

    if (user.balance < amount) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorInsufficientFunds,
      );
      return;
    }

    user.balance -= amount;
    await this._groupService.newBalanceMember(user, false);
    target.balance += amount;
    await this._groupService.newBalanceMember(target, false);

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      passMoneySuccessMessage(user, amount, target),
    );
  }

  @OnEvent(Commands.BALANCE_TOP)
  private async handleBalanceTop(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;

    const membersTop =
      await this._groupService.getTopGroupMembersByGroup(groupJid);
    const membersWithCounts: UserPosition[] = membersTop.map(
      (member, index) => ({
        jid: member.jid,
        name: member.name,
        balance: member.balance,
        position: index + 1,
      }),
    );

    const finalMessage = this.buildTopMessage(membersWithCounts);

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: finalMessage,
      },
      { quoted: WaMessage },
    );
  }

  private buildTopMessage(membersWithCounts: UserPosition[]): string {
    let message = `*Butter God 🧈:* My best warriors are:\n`;
    let prevPosition = -1;

    membersWithCounts.forEach((member) => {
      if (prevPosition !== member.position) {
        message += `${member.position}. `;
      }
      message += `${member.name} with *${getFormatedNumber(member.balance)}*\n`;
      prevPosition = member.position;
    });

    return message;
  }
}
