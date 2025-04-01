import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands, Cooldown } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupMember } from 'src/group/models/group-member.model';
import { GroupService } from 'src/group/services/group.service';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import {
  getFormatedNumber,
  getNumberFromString,
} from '../../utils/event-handlers.utils';
import {
  rouletteHelperMessage,
  errorNotEnoughMoneyToBetMessage,
  rouletteHelperPredictionMessage,
  errorAmountMessage,
  rouletteColor,
  rouletteColorWithoutP,
  rouletteErrorPredictionMessage,
} from '../../utils/message-sender.utils';

@Injectable()
export class RouletteHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}
  @OnEvent(Commands.ROULETTE)
  private async handleRoulette(payload: CommandPayload, user: GroupMember) {
    const { groupJid, args, WaMessage, client } = payload;

    const userCooldown = Commands.ROULETTE + Cooldown;

    // Must have args
    if (args.length === 0) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        rouletteHelperMessage,
      );
      return;
    }

    // Get the user bet and prediction
    const userBet = args[0];
    const userPrediction = args.filter((_, index) => index !== 0);

    // First validation --> Check if the user bet on both colors
    if (
      userPrediction.includes(rouletteColor[0]) &&
      userPrediction.includes(rouletteColor[1])
    ) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        'You can only bet on one color at a time!',
      );
      return;
    }

    // Second validation --> Check if the prediction is correct  p:<color/number>
    if (userPrediction.some((prediction) => !prediction.startsWith('p:'))) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        rouletteHelperPredictionMessage,
      );
      return;
    }

    // Remove the 'p:' from the prediction
    const userPredictionWithoutP = userPrediction.map((prediction) =>
      prediction.slice(2),
    );

    // Third validation --> Check if the prediction is between 0 and 36 and if the color is red or black
    const validatePrediction = userPredictionWithoutP.some((prediction) => {
      const isNumber = !isNaN(parseInt(prediction));
      if (isNumber) {
        return parseInt(prediction) < 0 || parseInt(prediction) > 36;
      }
      return !rouletteColorWithoutP.includes(prediction);
    });
    if (validatePrediction) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        rouletteErrorPredictionMessage,
      );
      return;
    }

    // Fourth validation --> Check the bets are numbers
    const { amount, isNumber } = getNumberFromString(userBet);
    if (!isNumber) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorAmountMessage,
      );
      return;
    }

    // Fifth validation --> Check if the user has enough money to bet
    const totalBet = amount * userPredictionWithoutP.length;

    if (user.balance < totalBet) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorNotEnoughMoneyToBetMessage(user.balance),
      );
      return;
    }

    // Create the final bet prediction
    const finalBetPrediction = userPredictionWithoutP.map((prediction) => {
      return { prediction, amount: amount };
    });

    const rouletteResult = Math.floor(Math.random() * 37);

    const colorResult =
      rouletteResult === 0 || rouletteResult === 35
        ? 'green'
        : rouletteResult % 2 === 0
          ? 'red'
          : 'black';

    // Check if the user won
    const newBalance: number[] = [];
    const userWonMessage = finalBetPrediction.map((bet) => {
      if (bet.prediction === colorResult) {
        newBalance.push(bet.amount);
        return `You won *${getFormatedNumber(bet.amount)}* betting on *${colorResult}*!`;
      }
      if (bet.prediction === rouletteResult.toString()) {
        newBalance.push(bet.amount * 35);
        return `You won *${getFormatedNumber(bet.amount * 35)}* betting on *${rouletteResult}*!`;
      }
      newBalance.push(-bet.amount);
      return `You lost *-${getFormatedNumber(bet.amount)}* betting on *${bet.prediction}*!`;
    });

    const totalBalanceWon = newBalance.reduce((acc, curr) => acc + curr, 0);

    // Update the user balance
    await this._groupService.updateBalance(
      user,
      { [userCooldown]: new Date() },
      totalBalanceWon,
    );

    const colorResultMessage =
      rouletteResult === 0 || rouletteResult === 35
        ? '🟢'
        : rouletteResult % 2 === 0
          ? '🔴'
          : '⚫';
    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      '*Roulette result: ' +
        rouletteResult +
        ' ' +
        colorResultMessage +
        '*\n' +
        userWonMessage.join('\n') +
        '\n' +
        `Final result: *${getFormatedNumber(totalBalanceWon)}*`,
    );
  }
}
