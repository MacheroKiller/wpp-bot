import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WAMessage } from 'baileys';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { getMentionedJids } from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import { getNumberFromString } from '../utils/event-handlers.utils';

@Injectable()
export class BalanceHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
  ) {}

  @OnEvent(Commands.BALANCE)
  @OnEvent(Commands.MONEY)
  async handleBalance(payload: CommandPayload) {
    const { groupJid, senderJid, WaMessage, client } = payload;

    const mentionedJids = getMentionedJids(WaMessage);
    const jidToFind = mentionedJids?.length ? mentionedJids[0] : senderJid;

    const response = await this._groupService.getGroupMemberByJid(jidToFind);

    if (!response) {
      await this._accountHandler.handleNoUserFound(payload);
      return;
    }

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `${response.name} balance is *$${response.balance}MP*`,
      },
      { quoted: WaMessage },
    );
  }

  @OnEvent(Commands.PASS_MONEY)
  private async handlePassMoney(payload: CommandPayload) {
    const { groupJid, senderJid, args, WaMessage, client } = payload;
    const mentionedJids = getMentionedJids(WaMessage);

    // Can continue?
    if (!(await this._accountHandler.handleCommandTime(payload))) {
      return;
    }

    if (!mentionedJids.length) {
      await this.errorMentionMessage(groupJid, WaMessage, client);
      return;
    }

    const sender = await this._groupService.getGroupMemberByJid(senderJid);
    const receiver = await this._groupService.getGroupMemberByJid(
      mentionedJids[0],
    );
    const { amount, isNumber } = getNumberFromString(args[1]);

    if (!sender || !receiver) {
      await this._accountHandler.handleNoUserFound(payload);
      return;
    }
    if (!args[1]) {
      await this.errorAmountMessage(groupJid, WaMessage, client);
      return;
    }

    if (!isNumber) {
      await this.errorAmountMessage(groupJid, WaMessage, client);
      return;
    }

    if (sender.balance < amount) {
      await this.errorInsufficientFunds(groupJid, WaMessage, client);
      return;
    }

    await this._groupService.newBalanceMember(sender, sender.balance - amount);
    await this._groupService.newBalanceMember(
      receiver,
      receiver.balance + amount,
    );

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*${sender.name}* passed *$${amount}MP* to *${receiver.name}*`,
      },
      { quoted: WaMessage },
    );
  }

  private async errorMentionMessage(
    groupJid: string,
    WaMessage: WAMessage,
    client,
  ) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `Maybe if you mention someone...`,
      },
      { quoted: WaMessage },
    );
  }

  private async errorAmountMessage(
    groupJid: string,
    WaMessage: WAMessage,
    client,
  ) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `You need to pass an amount of money duuuh!.`,
      },
      { quoted: WaMessage },
    );
  }

  private async errorInsufficientFunds(
    groupJid: string,
    WaMessage: WAMessage,
    client,
  ) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `You don't have that money bruh.`,
      },
      { quoted: WaMessage },
    );
  }
}
