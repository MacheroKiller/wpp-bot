import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';

@Injectable()
export class HelpHandlerService {
  @OnEvent(Commands.HELP)
  async handleHelp(payload: CommandPayload) {
    const { senderJid, client } = payload;
    const helpMessage = `Welcome to the help menu! 🤖
*Available commands:*
- *${Commands.HELP}*: Display this message.
- *${Commands.COIN_FLIP}*: 1. Flip a coin. 2. Write face or seal to predict the result.
- *${Commands.KISS}*: Mention someone to kiss him.`;
    await client._wppSocket.sendMessage(senderJid, { text: helpMessage });
  }
}
