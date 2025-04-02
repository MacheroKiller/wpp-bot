import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands, Cooldown } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import {
  getRandomNumber,
  getNumberFromString,
} from '../../utils/event-handlers.utils';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import {
  coinFlip,
  correctPredictionMessage,
  errorBetMessage,
  errorNotEnoughMoneyToBetMessage,
  errorPredictionMessage,
  failPredictionMessage,
} from '../../utils/message-sender.utils';
import { GroupMember } from 'src/group/models/group-member.model';

@Injectable()
export class CoinFlipHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.COIN_FLIP)
  private async handleCoinFlip(payload: CommandPayload, user: GroupMember) {
    const { groupJid, args, WaMessage, client } = payload;

    const userCooldown = Commands.COIN_FLIP + Cooldown;

    const coinFlipResult = getRandomNumber() % 2 === 0 ? 'Face' : 'Seal';

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
    const finalAmount = isPredictionCorrect ? amount : -amount;
    await this._groupService.updateBalance(
      user,
      { [userCooldown]: new Date() },
      finalAmount,
    );
  }
}
