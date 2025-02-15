import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import {
  getRandomNumber,
  getNumberFromString,
} from '../../utils/event-handlers.utils';
import { MessageSenderService } from '../message.sender/message.sender.service';
import {
  coinFlip,
  coinFlipResultMessage,
  correctPredictionMessage,
  errorBetMessage,
  errorNotEnoughMoneyToBetMessage,
  errorPredictionMessage,
  failPredictionMessage,
} from '../../utils/message-sender.utils';

@Injectable()
export class CoinFlipHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.COIN_FLIP)
  private async handleCoinFlip(payload: CommandPayload) {
    const { groupJid, args, WaMessage, client } = payload;

    const coinFlipResult = getRandomNumber() % 2 === 0 ? 'Face' : 'Seal';

    // if (!args.length) {
    //   await this._messageSender.handleMessage(
    //     groupJid,
    //     WaMessage,
    //     client,
    //     coinFlipResultMessage(coinFlipResult),
    //   );
    //   return;
    // }

    const { user } =
      await this._accountHandler.genericVerifyUserColdownAndTarget(
        payload,
        true,
        false,
      );

    // No user found
    if (!user) return;

    // Bet prediction
    const userPrediction = args[0] ? args[0].toLowerCase() : '';
    const { amount } = getNumberFromString(args[1]);

    if (!coinFlip.includes(userPrediction)) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorPredictionMessage,
      );
      return;
    }

    if (!amount) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorBetMessage,
      );
      return;
    }

    if (user.balance <= 0 || amount > user.balance) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorNotEnoughMoneyToBetMessage(user.balance),
      );
      return;
    }

    const isPredictionCorrect = coinFlipResult.toLowerCase() === userPrediction;

    const resultMessage = isPredictionCorrect
      ? correctPredictionMessage(amount, coinFlipResult)
      : failPredictionMessage(amount, coinFlipResult);

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      resultMessage,
    );

    // Update user balance
    user.balance += isPredictionCorrect ? amount : -amount;
    await this._groupService.newBalanceMember(user);
  }
}
