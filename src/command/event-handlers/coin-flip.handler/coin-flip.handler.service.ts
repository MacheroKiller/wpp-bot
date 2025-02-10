import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WAMessage } from 'baileys';
import { coinFlip, Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';

@Injectable()
export class CoinFlipHandlerService {
  @OnEvent(Commands.COIN_FLIP)
  async handleCoinFlip(payload: CommandPayload) {
    const { groupJid, args, WaMessage, client } = payload;
    const coinFlipResult = Math.random() < 0.5 ? 'Face' : 'Seal';

    if (args.length === 0) {
      await client._wppSocket.sendMessage(
        groupJid,
        { text: `The result is: ${coinFlipResult}.` },
        { quoted: WaMessage },
      );
      return;
    }

    const userPrediction = args[0].toLowerCase();
    if (!coinFlip.includes(userPrediction)) {
      await this.errorPredictionMessage(groupJid, WaMessage, client);
      return;
    }

    const isPredictionCorrect =
      coinFlipResult.toLowerCase() === userPrediction
        ? 'Nice prediction! Youre the oracle +$100.'
        : 'Oops! You got it wrong -$50.';

    await client._wppSocket.sendMessage(
      groupJid,
      { text: `The result is: ${coinFlipResult}. ${isPredictionCorrect}` },
      { quoted: WaMessage },
    );
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
}
