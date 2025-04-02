import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import {
  getMentionedJids,
  jidToNumber,
} from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { PathFile } from '../constants/actions.constants';
import { getRandomImage } from '../../utils/event-handlers.utils';

@Injectable()
export class PunchHandlerService {
  @OnEvent(Commands.PUNCH)
  async handlePunch(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;
    const mentionedJids = getMentionedJids(WaMessage);

    if (!mentionedJids?.length) {
      await client._wppSocket.sendMessage(
        groupJid,
        {
          text: 'Please mention the user you want to punch after the command.',
        },
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
          url: getRandomImage(PathFile.IMAGE_PUNCH_PATH),
        },
        caption: `🤜🏻 @${jidToNumber(WaMessage.key.participant!)} *punched* @${jidToNumber(mentionedJid)} 🤛🏻`,
        mentions: [WaMessage.key.participant!, mentionedJid],
        viewOnce: false,
      },
      { quoted: WaMessage },
    );
  }
}
