import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WAMessage } from 'baileys';
import { coinFlip, Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import {
  getNumberFromString,
  getRandomNumber,
} from '../utils/event-handlers.utils';

@Injectable()
export class CoinFlipHandlerService {
  constructor(private readonly _groupService: GroupService) {}

  @OnEvent(Commands.COIN_FLIP)
  async handleCoinFlip(payload: CommandPayload) {
    const { groupJid, senderJid, args, WaMessage, client } = payload;
    const coinFlipResult = getRandomNumber() % 2 === 0 ? 'Face' : 'Seal';

    if (args.length === 0) {
      await client._wppSocket.sendMessage(
        groupJid,
        { text: `The result is: ${coinFlipResult}.` },
        { quoted: WaMessage },
      );
      return;
    }
    // Bet prediction
    const userPrediction = args[0].toLowerCase();
    const { userBet, isNumber } = getNumberFromString(args[1]);

    if (!isNumber) {
      await this.errorBetMessage(groupJid, WaMessage, client);
      return;
    }
    if (!coinFlip.includes(userPrediction)) {
      await this.errorPredictionMessage(groupJid, WaMessage, client);
      return;
    }

    const user = await this._groupService.getGroupMemberByJid(senderJid);

    if (user.balance === undefined) {
      await client._wppSocket.sendMessage(
        groupJid,
        {
          text: `First create a balance with the command *!${Commands.BALANCE}*`,
        },
        { quoted: WaMessage },
      );
      return;
    }

    if (user.balance <= 0) {
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
      ? `Nice prediction! Youre the oracle *+$${userBet}MP*.`
      : `Oops! You got it wrong *-$${userBet}MP*.`;

    await client._wppSocket.sendMessage(
      groupJid,
      { text: `The result is: ${coinFlipResult}. ${resultMessage}` },
      { quoted: WaMessage },
    );

    // Update user balance
    const newBalance = (user.balance += isPredictionCorrect
      ? userBet
      : -userBet);
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
