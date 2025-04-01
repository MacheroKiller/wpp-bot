import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import {
  getFormatedNumber,
  getNumberFromString,
} from '../../utils/event-handlers.utils';
import { UserPosition } from './interfaces/balance-top.handler.interface';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import {
  errorAmountMessage,
  errorInsufficientFunds,
  passMoneySuccessMessage,
  userBalance,
} from '../../utils/message-sender.utils';
import { GroupMember } from 'src/group/models/group-member.model';

@Injectable()
export class BalanceHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.BALANCE)
  @OnEvent(Commands.MONEY)
  private async handleBalance(
    payload: CommandPayload,
    user: GroupMember,
    target: GroupMember,
  ) {
    const { groupJid, WaMessage, client } = payload;

    const response = target.name ? target : user;

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      userBalance(response),
    );
  }

  @OnEvent(Commands.PASS_MONEY)
  private async handlePassMoney(
    payload: CommandPayload,
    user: GroupMember,
    target: GroupMember,
  ) {
    const { groupJid, args, WaMessage, client } = payload;

    const { amount, isNumber } = getNumberFromString(args[1]);

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

    await this._groupService.updateBalance(user, {}, amount * -1);
    await this._groupService.updateBalance(target, {}, amount);

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
