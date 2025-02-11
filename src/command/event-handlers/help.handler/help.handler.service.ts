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
- *${Commands.KISS}*: Mention someone to kiss him (unavailable).
- *${Commands.CREATE_ACCOUNT}*: Create an account to play MACHMINE!.
- *${Commands.COIN_FLIP}*: Flip a coin.
- *${Commands.COIN_FLIP}*: <seal/face> to predict the result of the coin flip for default is $50MP.
- *${Commands.COIN_FLIP}*: <seal/face> <money> to bet an amount of money.
- *${Commands.BALANCE} / ${Commands.MONEY}*: Know you balance.
- *${Commands.PASS_MONEY}*: <@user> <money> pass money to someone.
- *${Commands.MINE}*: Mine some money.
- *${Commands.STORE}*: Items available in the shop!
- *${Commands.BUY}*: <ItemID> Buy items.
- *${Commands.INFO}*: <ItemID> Know the stats about an item.
- *${Commands.PROFILE}*: Know the stats about you.
`;

    await client._wppSocket.sendMessage(senderJid, { text: helpMessage });
  }
}
