import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { getRandomKissImage } from '../../utils/event-handlers.utils';
import {
  getMentionedJids,
  jidToNumber,
} from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';

@Injectable()
export class KissHandlerService {
  //@OnEvent(Commands.KISS)
  async handleKiss(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;
    const mentionedJids = getMentionedJids(WaMessage);

    if (!mentionedJids?.length) {
      await client._wppSocket.sendMessage(
        groupJid,
        { text: 'Please mention the user you want to kiss after the command.' },
        { quoted: WaMessage },
      );
      return;
    }

    // Just get the first mentioned user
    const mentionedJid = mentionedJids[0];

    await client._wppSocket.sendMessage(
      groupJid,
      {
        image: {
          url: getRandomKissImage(),
        },
        caption: `@${jidToNumber(WaMessage.key.participant!)} kissed @${jidToNumber(mentionedJid)}`,
        mentions: [WaMessage.key.participant!, mentionedJid],
        viewOnce: true,
      },
      { quoted: WaMessage },
    );
  }
}
