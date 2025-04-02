import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import {
  getMentionedJids,
  jidToNumber,
} from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { getRandomImage } from '../../utils/event-handlers.utils';
import { PathFile } from '../constants/actions.constants';

@Injectable()
export class KillHandlerService {
  @OnEvent(Commands.KILL)
  async handleKill(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;
    const mentionedJids = getMentionedJids(WaMessage);

    if (!mentionedJids?.length) {
      await client._wppSocket.sendMessage(
        groupJid,
        { text: 'Please mention the user you want to kill after the command.' },
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
          url: getRandomImage(PathFile.IMAGE_KILL_PATH),
        },
        caption: `💀 @${jidToNumber(WaMessage.key.participant!)} *killed* @${jidToNumber(mentionedJid)} 💀`,
        mentions: [WaMessage.key.participant!, mentionedJid],
        viewOnce: false,
      },
      { quoted: WaMessage },
    );
  }
}
