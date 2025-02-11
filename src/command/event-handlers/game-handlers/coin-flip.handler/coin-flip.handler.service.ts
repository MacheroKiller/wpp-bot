import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WAMessage } from 'baileys';
import { coinFlip, Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import {
  getRandomNumber,
  getNumberFromString,
} from '../../utils/event-handlers.utils';

@Injectable()
export class CoinFlipHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
  ) {}

  @OnEvent(Commands.COIN_FLIP)
  private async handleCoinFlip(payload: CommandPayload) {
    const { groupJid, senderJid, args, WaMessage, client } = payload;

    const coinFlipResult = getRandomNumber() % 2 === 0 ? 'Face' : 'Seal';

    if (!args.length) {
      await client._wppSocket.sendMessage(
        groupJid,
        { text: `The result is: ${coinFlipResult}.` },
        { quoted: WaMessage },
      );
      return;
    }

    // Can continue --> This is when the user has an account and bet a number
    if (!(await this._accountHandler.handleCommandTime(payload))) {
      return;
    }

    // Bet prediction
    const userPrediction = args[0].toLowerCase();
    const { amount, isNumber } = getNumberFromString(args[1]);

    if (!isNumber) {
      await this.errorBetMessage(groupJid, WaMessage, client);
      return;
    }
    if (!coinFlip.includes(userPrediction)) {
      await this.errorPredictionMessage(groupJid, WaMessage, client);
      return;
    }

    const user = await this._groupService.getGroupMemberByJid(senderJid);

    if (!user) {
      await this._accountHandler.handleNoAccount(payload);
      return;
    }

    if (user.balance <= 0 || amount > user.balance) {
      await client._wppSocket.sendMessage(
        groupJid,
        {
          text: `You dont have enough money to bet: *$${user.balance}MP*`,
        },
        { quoted: WaMessage },
      );
      return;
    }

    const isPredictionCorrect = coinFlipResult.toLowerCase() === userPrediction;

    const resultMessage = isPredictionCorrect
      ? `Nice prediction! Youre the oracle *+$${amount}MP*.`
      : `Oops! You got it wrong *-$${amount}MP*.`;

    await client._wppSocket.sendMessage(
      groupJid,
      { text: `The result is: *${coinFlipResult}*. ${resultMessage}` },
      { quoted: WaMessage },
    );

    // Update user balance
    const newBalance = (user.balance += isPredictionCorrect ? amount : -amount);
    await this._groupService.newBalanceMember(user, newBalance);
  }

  private async errorPredictionMessage(
    groupJid,
    _waMessage: WAMessage,
    client,
  ): Promise<void> {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: 'Dumb! You can only predict "face" or "seal".',
      },
      { quoted: _waMessage },
    );
  }

  private async errorBetMessage(
    groupJid,
    _waMessage: WAMessage,
    client,
  ): Promise<void> {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: 'Wtf? bro, you need to bet a number!!.',
      },
      { quoted: _waMessage },
    );
  }
}
